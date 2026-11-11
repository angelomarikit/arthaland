import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { PropertyPublicVisibilityPanel } from '../../components/admin/PropertyPublicVisibilityPanel'
import { MediaThumb, MediaUploadZone } from '../../components/admin/MediaUploadZone'
import {
  fetchAdminDevelopment,
  fetchDevelopmentMedia,
  updateDevelopment,
  updateMediaRow,
} from '../../lib/cms/developmentsApi'
import { uploadMediaBatch, mediaPublicUrl, deleteAdminCmsMedia } from '../../lib/cms/mediaUpload'
import type { DbCmsMedia } from '../../lib/supabase/database.types'

export function AdminPropertyMediaPage() {
  const { slug = '' } = useParams()
  const [devId, setDevId] = useState('')
  const [devName, setDevName] = useState('')
  const [media, setMedia] = useState<DbCmsMedia[]>([])
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    const dev = await fetchAdminDevelopment(slug)
    if (!dev) return
    setDevId(dev.id)
    setDevName(dev.name)
    setMedia(await fetchDevelopmentMedia(slug))
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
        Images here appear in the public <strong>gallery</strong> when <code className="text-xs">published</code>{' '}
        is on. They do <strong>not</strong> replace the hero — use Overview → Hero for the top image.
        Use &quot;Set as cover&quot; for portfolio cards, or upload hero on Overview (syncs card when
        appropriate).
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

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-[4/3] bg-surface-muted">
              <MediaThumb media={m} />
            </div>
            <div className="space-y-2 p-3 text-sm">
              <p className="text-xs text-title-muted">
                {m.placement ?? '—'} · order {m.display_order} ·{' '}
                {m.published ? 'Public' : 'Hidden'}
              </p>
              <input
                defaultValue={m.alt_text ?? ''}
                placeholder="Alt text"
                className="w-full rounded-lg border border-border px-2 py-1 text-xs"
                onBlur={(e) =>
                  void updateMediaRow(m.id, { alt_text: e.target.value }).then(reload)
                }
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={() =>
                    void updateMediaRow(m.id, {
                      display_order: Math.max(0, m.display_order - 1),
                    }).then(reload)
                  }
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={() =>
                    void updateMediaRow(m.id, {
                      display_order: m.display_order + 1,
                    }).then(reload)
                  }
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={() =>
                    void updateMediaRow(m.id, { published: !m.published }).then(reload)
                  }
                >
                  {m.published ? 'Hide from site' : 'Publish'}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={async () => {
                    const url = mediaPublicUrl(m)
                    await updateDevelopment(devId, {
                      cover_image: url,
                      card_image: url,
                    })
                    await updateMediaRow(m.id, { is_cover: true })
                    await reload()
                  }}
                >
                  Set as cover
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-800 hover:bg-red-50"
                  onClick={() => void deleteMediaItem(m)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
