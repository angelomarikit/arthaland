import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchDashboardStats } from '../../lib/cms/developmentsApi'

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    published: 0,
    draft: 0,
    recentInquiries: 0,
    missingHero: 0,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Dashboard' }]} />
      <h1 className="text-2xl font-medium tracking-tight">Overview</h1>
      {error && (
        <p className="mt-2 text-sm text-red-700">
          Could not load stats (is <code>002_full_cms.sql</code> applied?): {error}
        </p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Properties', value: stats.totalProperties, href: '/admin/properties' },
          { label: 'Published', value: stats.published, href: '/admin/properties' },
          { label: 'Draft', value: stats.draft, href: '/admin/properties' },
          { label: 'Inquiries (7d)', value: stats.recentInquiries, href: '/admin/inquiries' },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-title-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-medium tabular-nums">{card.value}</p>
          </Link>
        ))}
      </div>
      {stats.missingHero > 0 && (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {stats.missingHero} development(s) missing hero imagery — upload in property
          media manager.
        </p>
      )}
    </div>
  )
}
