import { useEffect, useState } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminDevelopments, fetchInquiries, updateInquiryStatus } from '../../lib/cms/developmentsApi'
import type { DbDevelopment, DbInquiry } from '../../lib/supabase/database.types'

export function AdminInquiriesPage() {
  const [rows, setRows] = useState<DbInquiry[]>([])
  const [developments, setDevelopments] = useState<DbDevelopment[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')

  async function reload() {
    const list = await fetchInquiries(100, propertyFilter || undefined)
    setRows(list)
  }

  useEffect(() => {
    fetchAdminDevelopments().then(setDevelopments)
  }, [])

  useEffect(() => {
    void reload()
  }, [propertyFilter])

  const filtered = rows.filter((r) => {
    if (!statusFilter) return true
    return (r.status ?? 'new') === statusFilter
  })

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Inquiries' }]} />
      <h1 className="text-2xl font-medium">Inquiry inbox</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
        >
          <option value="">All properties</option>
          {developments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="mt-6 space-y-4">
        {filtered.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border bg-surface p-5 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium">
                {r.first_name} {r.last_name}
              </p>
              <select
                value={r.status ?? 'new'}
                onChange={(e) =>
                  void updateInquiryStatus(r.id, e.target.value).then(reload)
                }
                className="rounded-lg border border-border px-2 py-1 text-xs"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="mt-1 text-title-muted">
              {r.email} · {r.phone}
            </p>
            {r.development_slug && (
              <p className="mt-1 text-xs">Property: {r.development_slug}</p>
            )}
            {r.unit_type_name && (
              <p className="mt-1 text-xs">Unit type: {r.unit_type_name}</p>
            )}
            <p className="mt-3 whitespace-pre-wrap">{r.message}</p>
            <p className="mt-2 text-xs text-title-muted">{r.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
