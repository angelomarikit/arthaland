import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaThumb, MediaUploadZone } from '../../components/admin/MediaUploadZone'
import {
  fetchAdminDevelopment,
  fetchDevelopmentMedia,
  fetchUnitTypes,
  upsertUnitType,
} from '../../lib/cms/developmentsApi'
import { deleteAdminCmsMedia, uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'
import type { DbCmsMedia, DbUnitType } from '../../lib/supabase/database.types'

export function AdminPropertyUnitsPage() {
  const { slug = '' } = useParams()
  const [devId, setDevId] = useState('')
  const [devName, setDevName] = useState('')
  const [units, setUnits] = useState<DbUnitType[]>([])
  const [floorPlans, setFloorPlans] = useState<Record<string, DbCmsMedia[]>>({})
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const dev = await fetchAdminDevelopment(slug)
    if (dev) {
      setDevId(dev.id)
      setDevName(dev.name)
    }
    setUnits(await fetchUnitTypes(slug))
    const all = await fetchDevelopmentMedia(slug)
    const byUnit: Record<string, DbCmsMedia[]> = {}
    for (const m of all) {
      if (m.placement === 'floor_plan' && m.unit_type_id) {
        const list = byUnit[m.unit_type_id] ?? []
        list.push(m)
        byUnit[m.unit_type_id] = list
      }
    }
    for (const id of Object.keys(byUnit)) {
      byUnit[id]!.sort((a, b) => a.display_order - b.display_order)
    }
    setFloorPlans(byUnit)
  }, [slug])

  useEffect(() => {
    reload().catch((e: Error) => setError(e.message))
  }, [reload])

  async function addUnit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const featuresRaw = String(fd.get('features') ?? '')
    const features = featuresRaw
      ? featuresRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    await upsertUnitType({
      id: crypto.randomUUID(),
      development_id: devId,
      development_slug: slug,
      name: String(fd.get('name')),
      area_min: Number(fd.get('area_min')) || null,
      area_max: Number(fd.get('area_max')) || null,
      bedrooms: String(fd.get('bedrooms') || ''),
      bathrooms: String(fd.get('bathrooms') || ''),
      description: String(fd.get('description') ?? '') || null,
      features,
      tab_group: String(fd.get('tab_group') ?? 'custom') as DbUnitType['tab_group'],
      brochure_url: String(fd.get('brochure_url') ?? '') || null,
      price_note: String(fd.get('price_note') ?? '') || null,
      publication_status: 'draft',
      display_order: units.length,
    })
    await reload()
    e.currentTarget.reset()
  }

  async function deleteFloorPlan(media: DbCmsMedia) {
    if (!window.confirm('Delete this floor plan image?')) return
    setError(null)
    try {
      await deleteAdminCmsMedia(media)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: devName || slug, href: `/admin/properties/${slug}` },
          { label: 'Units' },
        ]}
      />
      <h1 className="text-2xl font-medium">Unit types</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={addUnit} className="mt-6 grid max-w-xl gap-3 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-medium">Add unit type</h2>
        <input name="name" required placeholder="Name" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input name="area_min" type="number" placeholder="Area min" className="rounded-xl border border-border px-3 py-2 text-sm" />
          <input name="area_max" type="number" placeholder="Area max" className="rounded-xl border border-border px-3 py-2 text-sm" />
        </div>
        <input name="bedrooms" placeholder="Bedrooms" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <input name="bathrooms" placeholder="Bathrooms" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Description" rows={2} className="rounded-xl border border-border px-3 py-2 text-sm" />
        <input name="features" placeholder="Features (comma-separated)" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <select name="tab_group" className="rounded-xl border border-border px-3 py-2 text-sm">
          <option value="studio">Studio</option>
          <option value="one_bedroom">1 bedroom</option>
          <option value="two_bedroom">2 bedroom</option>
          <option value="three_bedroom">3 bedroom</option>
          <option value="custom">Custom</option>
        </select>
        <input name="brochure_url" placeholder="Brochure URL" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <input name="price_note" placeholder="Price note" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save unit type
        </button>
      </form>

      <ul className="mt-8 space-y-6">
        {units.map((u) => (
          <li key={u.id} className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-title-muted">
              {u.publication_status}
              {u.tab_group ? ` · ${u.tab_group}` : ''}
            </p>
            {u.description && <p className="mt-2 text-sm text-title-muted">{u.description}</p>}
            <div className="mt-4 max-w-md">
              <MediaUploadZone
                label="Unit render"
                accept="image"
                onUpload={async (file, onProgress) => {
                  await uploadMediaWithMetadata({
                    file,
                    bucket: 'arthaland-images',
                    folder: `developments/${devId}/units/${u.id}/renders`,
                    developmentId: devId,
                    developmentSlug: slug,
                    unitTypeId: u.id,
                    placement: 'unit_render',
                    published: true,
                    displayOrder: 0,
                    onProgress,
                  })
                  await reload()
                }}
              />
            </div>
            <div className="mt-4 max-w-md">
              <MediaUploadZone
                label="Floor plan"
                accept="image"
                multiple
                helperText="Upload one or more floor plans. Delete duplicates below."
                onUpload={async (files, onProgress) => {
                  const start = floorPlans[u.id]?.length ?? 0
                  for (let i = 0; i < files.length; i++) {
                    await uploadMediaWithMetadata({
                      file: files[i]!,
                      bucket: 'arthaland-images',
                      folder: `developments/${devId}/units/${u.id}/floor-plans`,
                      developmentId: devId,
                      developmentSlug: slug,
                      unitTypeId: u.id,
                      placement: 'floor_plan',
                      published: true,
                      displayOrder: start + i,
                      onProgress,
                    })
                  }
                  await reload()
                }}
              />
            </div>
            {(floorPlans[u.id]?.length ?? 0) > 0 && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(floorPlans[u.id] ?? []).map((m) => (
                  <li key={m.id} className="overflow-hidden rounded-xl border border-border">
                    <div className="aspect-[4/3] bg-surface-muted">
                      <MediaThumb media={m} />
                    </div>
                    <button
                      type="button"
                      className="w-full border-t border-border py-2 text-xs text-red-800 hover:bg-red-50"
                      onClick={() => void deleteFloorPlan(m)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
