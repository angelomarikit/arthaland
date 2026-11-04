import { useEffect, useState } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchInquiries, updateInquiryStatus } from '../../lib/cms/developmentsApi'
import type { DbInquiry } from '../../lib/supabase/database.types'

export function AdminInquiriesPage() {
  const [rows, setRows] = useState<DbInquiry[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchInquiries(100).then(setRows)
  }, [])

  const filtered = rows.filter((r) => {
    if (!filter) return true
    return (r.status ?? 'new') === filter
  })

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Inquiries' }]} />
      <h1 className="text-2xl font-medium">Inquiry inbox</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mt-4 rounded-xl border border-border px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
      </select>
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
                  void updateInquiryStatus(r.id, e.target.value).then(() =>
                    fetchInquiries(100).then(setRows),
                  )
                }
                className="rounded-lg border border-border px-2 py-1 text-xs"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="mt-1 text-title-muted">{r.email} · {r.phone}</p>
            {r.development_slug && (
              <p className="mt-1 text-xs">Property: {r.development_slug}</p>
            )}
            <p className="mt-3 whitespace-pre-wrap">{r.message}</p>
            <p className="mt-2 text-xs text-title-muted">{r.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
