import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminDevelopment } from '../../lib/cms/developmentsApi'
import {
  deleteNearbyPlace,
  fetchAdminNearbyPlaces,
  upsertNearbyPlace,
} from '../../lib/cms/propertyDetailApi'
import type { DbDevelopment, DbDevelopmentNearbyPlace, NearbyCategory } from '../../lib/supabase/database.types'

export function AdminPropertyNearbyPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [rows, setRows] = useState<DbDevelopmentNearbyPlace[]>([])

  async function reload() {
    const [d, list] = await Promise.all([
      fetchAdminDevelopment(slug),
      fetchAdminNearbyPlaces(slug),
    ])
    setDev(d)
    setRows(list)
  }

  useEffect(() => {
    void reload()
  }, [slug])

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
    await upsertNearbyPlace({
      id: crypto.randomUUID(),
      development_id: dev.id,
      development_slug: slug,
      category: String(fd.get('category') ?? 'other') as NearbyCategory,
      name: String(fd.get('name') ?? ''),
      distance_label: String(fd.get('distance_label') ?? '') || null,
      notes: String(fd.get('notes') ?? '') || null,
      display_order: rows.length,
      published: fd.get('published') === 'on',
    })
    e.currentTarget.reset()
    await reload()
  }

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev?.name ?? slug, href: `/admin/properties/${slug}` },
          { label: 'Nearby' },
        ]}
      />
      <h1 className="text-2xl font-medium">Nearby places</h1>

      <form onSubmit={onAdd} className="mt-6 max-w-xl space-y-3 rounded-2xl border border-border bg-surface p-6">
        <input name="name" required placeholder="Name" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <select name="category" className="w-full rounded-xl border border-border px-3 py-2 text-sm">
          <option value="schools">Schools</option>
          <option value="shopping">Shopping</option>
          <option value="healthcare">Healthcare</option>
          <option value="parks">Parks</option>
          <option value="transport">Transport</option>
          <option value="business">Business</option>
          <option value="dining">Dining</option>
          <option value="other">Other</option>
        </select>
        <input name="distance_label" placeholder="Distance label" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <textarea name="notes" placeholder="Notes" rows={2} className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" />
          Published
        </label>
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Add place
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-4 text-sm">
            <span className="font-medium">{row.name}</span>
            <span className="text-title-muted">
              {' '}
              · {row.category}
              {row.distance_label ? ` · ${row.distance_label}` : ''}
            </span>
            <button
              type="button"
              className="text-xs text-red-800"
              onClick={() => void deleteNearbyPlace(row.id).then(reload)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
