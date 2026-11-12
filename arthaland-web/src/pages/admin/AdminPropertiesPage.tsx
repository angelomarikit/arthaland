import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminDevelopments } from '../../lib/cms/developmentsApi'
import type { DbDevelopment } from '../../lib/supabase/database.types'

export function AdminPropertiesPage() {
  const [rows, setRows] = useState<DbDevelopment[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminDevelopments()
      .then(setRows)
      .catch((e: Error) => setError(e.message))
  }, [])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.publication_status !== status) return false
      if (!query) return true
      const q = query.toLowerCase()
      return r.name.toLowerCase().includes(q) || r.slug.includes(q)
    })
  }, [rows, query, status])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Properties' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-medium">All developments</h1>
        <Link
          to="/admin/properties/new"
          className="rounded-xl bg-ink px-4 py-2 text-sm text-surface"
        >
          New property
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name or slug"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[220px] rounded-xl border border-border px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="coming_soon">Coming soon</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-title-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Hero</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 tabular-nums">{row.display_order ?? '—'}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-title-muted">{row.slug}</p>
                </td>
                <td className="px-4 py-3 capitalize">{row.publication_status ?? 'draft'}</td>
                <td className="px-4 py-3">
                  {row.featured ? (
                    <span title="Shown in Featured properties sidebar on property pages">
                      Featured
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">{row.hero_image ? '✓' : 'Missing'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/properties/${row.slug}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-ink/30"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
