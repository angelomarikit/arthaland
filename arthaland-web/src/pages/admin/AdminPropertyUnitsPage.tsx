import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchAdminDevelopment, fetchUnitTypes, upsertUnitType } from '../../lib/cms/developmentsApi'
import { uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'
import type { DbUnitType } from '../../lib/supabase/database.types'

export function AdminPropertyUnitsPage() {
  const { slug = '' } = useParams()
  const [devId, setDevId] = useState('')
  const [devName, setDevName] = useState('')
  const [units, setUnits] = useState<DbUnitType[]>([])

  useEffect(() => {
    fetchAdminDevelopment(slug).then((dev) => {
      if (dev) {
        setDevId(dev.id)
        setDevName(dev.name)
      }
    })
    fetchUnitTypes(slug).then(setUnits)
  }, [slug])

  async function addUnit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await upsertUnitType({
      id: crypto.randomUUID(),
      development_id: devId,
      development_slug: slug,
      name: String(fd.get('name')),
      area_min: Number(fd.get('area_min')) || null,
      area_max: Number(fd.get('area_max')) || null,
      bedrooms: String(fd.get('bedrooms') || ''),
      bathrooms: String(fd.get('bathrooms') || ''),
      publication_status: 'draft',
      display_order: units.length,
    })
    setUnits(await fetchUnitTypes(slug))
    e.currentTarget.reset()
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

      <form onSubmit={addUnit} className="mt-6 grid max-w-xl gap-3 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-medium">Add unit type</h2>
        <input name="name" required placeholder="Name" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input name="area_min" type="number" placeholder="Area min" className="rounded-xl border border-border px-3 py-2 text-sm" />
          <input name="area_max" type="number" placeholder="Area max" className="rounded-xl border border-border px-3 py-2 text-sm" />
        </div>
        <input name="bedrooms" placeholder="Bedrooms" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <input name="bathrooms" placeholder="Bathrooms" className="rounded-xl border border-border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save unit type
        </button>
      </form>

      <ul className="mt-8 space-y-6">
        {units.map((u) => (
          <li key={u.id} className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-title-muted">{u.publication_status}</p>
            <div className="mt-4 max-w-md">
              <MediaUploadZone
                label="Floor plan"
                accept="image"
                onUpload={async (file, onProgress) => {
                  await uploadMediaWithMetadata({
                    file,
                    bucket: 'arthaland-images',
                    folder: `developments/${devId}/units/${u.id}/floor-plans`,
                    developmentId: devId,
                    developmentSlug: slug,
                    unitTypeId: u.id,
                    placement: 'floor_plan',
                    published: true,
                    onProgress,
                  })
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
