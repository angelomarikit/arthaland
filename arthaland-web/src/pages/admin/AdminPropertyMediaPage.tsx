import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminSortableList } from '../../components/admin/AdminSortableList'
import { PropertyPublicVisibilityPanel } from '../../components/admin/PropertyPublicVisibilityPanel'
import { MediaThumb, MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { isPropertyGalleryMedia } from '../../lib/cms/propertyGalleryMedia'
import {
  fetchAdminDevelopment,
  fetchDevelopmentMedia,
  fetchUnitTypes,
  updateDevelopment,
  updateMediaRow,
} from '../../lib/cms/developmentsApi'
import { uploadMediaBatch, mediaPublicUrl, deleteAdminCmsMedia } from '../../lib/cms/mediaUpload'
import {
  isLayoutPlacement,
  resolveUnitTypeIdForMedia,
} from '../../lib/cms/unitLayoutMedia'
import type { DbCmsMedia, DbUnitType } from '../../lib/supabase/database.types'

export function AdminPropertyMediaPage() {
  const { slug = '' } = useParams()
  const [devId, setDevId] = useState('')
  const [devName, setDevName] = useState('')
  const [media, setMedia] = useState<DbCmsMedia[]>([])
  const [unitTypes, setUnitTypes] = useState<DbUnitType[]>([])
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    const dev = await fetchAdminDevelopment(slug)
    if (!dev) return
    setDevId(dev.id)
    setDevName(dev.name)
    const [m, units] = await Promise.all([
      fetchDevelopmentMedia(slug),
      fetchUnitTypes(slug),
    ])
    setMedia(m)
    setUnitTypes(units)
  }

  async function deleteMediaItem(item: DbCmsMedia) {
    const placement = item.placement ?? 'media'
    if (
      !window.confirm(
        `Delete this ${placement} image from storage? This cannot be undone.`,
      )
    ) {
      return
    }
    setError(null)
    try {
      await deleteAdminCmsMedia(item)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  useEffect(() => {
    reload().catch((e: Error) => setError(e.message))
  }, [slug])

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: devName || slug, href: `/admin/properties/${slug}` },
          { label: 'Media' },
        ]}
      />
      <h1 className="text-2xl font-medium">Gallery & media</h1>
      <p className="mt-2 max-w-2xl text-sm text-title-muted">
        <strong>Gallery photos</strong> only — upload here for the property photo gallery.{' '}
        <strong>Unit floor plans</strong> do <em>not</em> appear from this list unless each file is
        linked to a unit type below (best: upload on{' '}
        <Link to={`/admin/properties/${slug}/units`} className="underline">
          Units
        </Link>
        ).
      </p>
      <p className="mt-2 max-w-2xl text-sm text-title-muted">
        Hero image → Overview. Certifications → Certifications screen (not gallery).
      </p>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <PropertyPublicVisibilityPanel slug={slug} />

      <div className="mt-6">
        <MediaUploadZone
          multiple
          label="Add gallery images (bulk)"
          accept="image"
          helperText="Select or drag many files at once — each image is stored and listed below in order."
          onUpload={async (files, onProgress) => {
            const startOrder = media.length
            await uploadMediaBatch(
              files,
              (_file, index) => ({
                bucket: 'arthaland-images',
                folder: `developments/${devId}/gallery`,
                developmentId: devId,
                developmentSlug: slug,
                placement: 'gallery',
                displayOrder: startOrder + index,
                published: true,
              }),
              onProgress,
            )
            await reload()
          }}
        />
      </div>

      {(() => {
        const galleryRows = media
          .filter((m) => isPropertyGalleryMedia(m, undefined, { requirePublished: false }))
          .sort((a, b) => a.display_order - b.display_order)
        const layoutRows = media
          .filter((m) => isLayoutPlacement(m.placement))
          .sort((a, b) => a.display_order - b.display_order)
        const otherRows = media.filter(
          (m) =>
            !isPropertyGalleryMedia(m, undefined, { requirePublished: false }) &&
            !isLayoutPlacement(m.placement),
        )

        async function persistGalleryOrder(ordered: DbCmsMedia[]) {
          await Promise.all(
            ordered.map((row, index) => updateMediaRow(row.id, { display_order: index })),
          )
          await reload()
        }

        return (
          <>
            <h2 className="mt-10 text-sm font-medium">Property gallery (drag to reorder)</h2>
            <p className="mt-1 text-xs text-title-muted">
              These images can appear in the public photo gallery. Certification logos and floor
              plans are listed separately below.
            </p>
            <AdminSortableList
              className="mt-4 space-y-4"
              itemClassName="overflow-hidden rounded-2xl border border-border bg-surface"
              items={galleryRows}
              onReorder={(next) => void persistGalleryOrder(next)}
              renderItem={(m, handle) => (
                <GalleryMediaRow
                  m={m}
                  handle={handle}
                  devId={devId}
                  reload={reload}
                  deleteMediaItem={deleteMediaItem}
                />
              )}
            />

            {layoutRows.length > 0 ? (
              <>
                <h2 className="mt-10 text-sm font-medium">Unit layouts (floor plans & renders)</h2>
                <p className="mt-1 text-xs text-amber-900">
                  Each file must be linked to a unit and the unit must be{' '}
                  <strong>Published</strong> on the Units screen — otherwise visitors see an empty
                  Unit layouts section.
                </p>
                <ul className="mt-4 space-y-4">
                  {layoutRows.map((m) => (
                    <LayoutMediaRow
                      key={m.id}
                      m={m}
                      unitTypes={unitTypes}
                      slug={slug}
                      reload={reload}
                      deleteMediaItem={deleteMediaItem}
                    />
                  ))}
                </ul>
              </>
            ) : null}

            {otherRows.length > 0 ? (
              <>
                <h2 className="mt-10 text-sm font-medium">Other uploads</h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherRows.map((m) => (
                    <li key={m.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
                      <div className="aspect-[4/3] bg-surface-muted">
                        <MediaThumb media={m} />
                      </div>
                      <div className="space-y-2 p-3 text-sm">
                        <p className="text-xs text-title-muted">
                          {m.placement ?? '—'} · {m.published ? 'Public' : 'Hidden'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        )
      })()}
    </div>
  )
}

function LayoutMediaRow({
  m,
  unitTypes,
  slug,
  reload,
  deleteMediaItem,
}: {
  m: DbCmsMedia
  unitTypes: DbUnitType[]
  slug: string
  reload: () => Promise<void>
  deleteMediaItem: (item: DbCmsMedia) => Promise<void>
}) {
  const linkedId = resolveUnitTypeIdForMedia(m)
  const linkedName = unitTypes.find((u) => u.id === linkedId)?.name
  const unlinked = !linkedId

  return (
    <li className="flex flex-wrap gap-4 rounded-2xl border border-border bg-surface p-4">
      <div className="aspect-[4/3] w-32 shrink-0 bg-surface-muted">
        <MediaThumb media={m} />
      </div>
      <div className="min-w-0 flex-1 space-y-2 text-sm">
        <p className="text-xs text-title-muted">
          {m.placement ?? '—'} · {m.published ? 'Public' : 'Hidden'}
          {unlinked ? (
            <span className="ml-2 font-medium text-amber-900">Not linked to a unit</span>
          ) : (
            <span className="ml-2 text-emerald-900">→ {linkedName ?? 'Unit'}</span>
          )}
        </p>
        {unitTypes.length === 0 ? (
          <p className="text-xs text-amber-900">
            <Link to={`/admin/properties/${slug}/units`} className="underline">
              Add unit types first
            </Link>{' '}
            before layouts can appear on the site.
          </p>
        ) : (
          <label className="block text-xs">
            Link to unit type
            <select
              className="mt-1 w-full max-w-md rounded-lg border border-border px-2 py-1 text-sm"
              value={linkedId ?? ''}
              onChange={(e) => {
                const unitId = e.target.value || null
                void updateMediaRow(m.id, {
                  unit_type_id: unitId,
                  placement: m.placement === 'unit_render' ? 'unit_render' : 'floor_plan',
                }).then(reload)
              }}
            >
              <option value="">— Select unit —</option>
              {unitTypes.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.publication_status ?? 'draft'})
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block text-xs">
          Image role
          <select
            className="mt-1 w-full max-w-md rounded-lg border border-border px-2 py-1 text-sm"
            value={m.placement === 'unit_render' ? 'unit_render' : 'floor_plan'}
            onChange={(e) =>
              void updateMediaRow(m.id, {
                placement: e.target.value,
              }).then(reload)
            }
          >
            <option value="floor_plan">Floor plan (zoomable layout)</option>
            <option value="unit_render">Unit render (preview image)</option>
          </select>
        </label>
        <LayoutMediaActions m={m} reload={reload} deleteMediaItem={deleteMediaItem} />
      </div>
    </li>
  )
}

function LayoutMediaActions({
  m,
  reload,
  deleteMediaItem,
}: {
  m: DbCmsMedia
  reload: () => Promise<void>
  deleteMediaItem: (item: DbCmsMedia) => Promise<void>
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <button
        type="button"
        className="rounded-lg border border-border px-2 py-1 text-xs"
        onClick={() => void updateMediaRow(m.id, { published: !m.published }).then(reload)}
      >
        {m.published ? 'Hide from site' : 'Publish'}
      </button>
      <button
        type="button"
        className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-800"
        onClick={() => void deleteMediaItem(m)}
      >
        Delete
      </button>
    </div>
  )
}

function GalleryMediaRow({
  m,
  handle,
  devId,
  reload,
  deleteMediaItem,
}: {
  m: DbCmsMedia
  handle: ReactNode
  devId: string
  reload: () => Promise<void>
  deleteMediaItem: (item: DbCmsMedia) => Promise<void>
}) {
  return (
    <div className="flex gap-3 p-3">
      <div className="flex shrink-0 flex-col items-center gap-2 pt-1">{handle}</div>
      <div className="aspect-[4/3] w-28 shrink-0 bg-surface-muted">
        <MediaThumb media={m} />
      </div>
      <div className="min-w-0 flex-1 space-y-2 text-sm">
        <p className="text-xs text-title-muted">
          {m.placement ?? '—'} · order {m.display_order} · {m.published ? 'Public' : 'Hidden'}
        </p>
        <input
          defaultValue={m.alt_text ?? ''}
          placeholder="Alt text"
          className="w-full rounded-lg border border-border px-2 py-1 text-xs"
          onBlur={(e) => void updateMediaRow(m.id, { alt_text: e.target.value }).then(reload)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-border px-2 py-1 text-xs"
            onClick={() => void updateMediaRow(m.id, { published: !m.published }).then(reload)}
          >
            {m.published ? 'Hide from site' : 'Publish'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-2 py-1 text-xs"
            onClick={async () => {
              const url = mediaPublicUrl(m)
              await updateDevelopment(devId, { cover_image: url, card_image: url })
              await updateMediaRow(m.id, { is_cover: true })
              await reload()
            }}
          >
            Set as cover
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-800"
            onClick={() => void deleteMediaItem(m)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
