import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminPages } from '../../lib/cms/pagesApi'
import type { DbPage } from '../../lib/supabase/database.types'

export function AdminPagesPage() {
  const [pages, setPages] = useState<DbPage[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminPages()
      .then(setPages)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Pages' }]} />
      <h1 className="text-2xl font-medium">Website pages</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <ul className="mt-8 space-y-3">
        {pages.map((p) => (
          <li key={p.id}>
            <Link
              to={`/admin/pages/${p.slug}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 hover:border-ink/30"
            >
              <span className="font-medium">{p.title}</span>
              <span className="text-xs text-title-muted">
                {p.published ? 'Published' : 'Draft'} · /{p.slug}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
