import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminBarChart, AdminSparkline } from '../../components/admin/AdminBarChart'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { siteImageRegistry } from '../../config/siteImageRegistry'
import {
  fetchDashboardStats,
  fetchInquiryAnalytics,
} from '../../lib/cms/developmentsApi'

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    published: 0,
    draft: 0,
    recentInquiries: 0,
    missingHero: 0,
  })
  const [analytics, setAnalytics] = useState<Awaited<
    ReturnType<typeof fetchInquiryAnalytics>
  > | null>(null)
  const [error, setError] = useState<string | null>(null)

  const placeholderImages = siteImageRegistry.filter(
    (e) => e.status === 'illustrative',
  ).length

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchInquiryAnalytics()])
      .then(([s, a]) => {
        setStats(s)
        setAnalytics(a)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  const sparkPoints = analytics?.last14Days.map((d) => d.value) ?? []
  const sparkLabels = analytics?.last14Days.map((d) => d.label) ?? []

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Dashboard' }]} />
      <h1 className="text-2xl font-medium tracking-tight">Good day</h1>
      <p className="mt-1 text-sm text-title-muted">
        Snapshot of your website content and incoming leads.
      </p>
      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
          Could not load live stats: {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Properties', value: stats.totalProperties, href: '/admin/properties' },
          { label: 'Published', value: stats.published, href: '/admin/properties' },
          { label: 'Inquiries (7 days)', value: stats.recentInquiries, href: '/admin/inquiries' },
          {
            label: 'All-time inquiries',
            value: analytics?.totalAllTime ?? '—',
            href: '/admin/inquiries',
          },
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminSparkline
          title="Inquiry activity"
          subtitle="Last 14 days — each dot is one day. This reflects contact form and widget submissions (not full site visits)."
          points={sparkPoints}
          labels={sparkLabels}
        />
        <AdminBarChart
          title="Inquiries by property"
          subtitle="Last 14 days — which development people asked about"
          data={analytics?.byDevelopment ?? []}
          emptyMessage="No inquiries yet — forms are working when entries appear here."
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminBarChart
          title="Where inquiries came from"
          subtitle="Last 14 days — website, help widget, etc."
          data={analytics?.bySource ?? []}
          emptyMessage="No source data yet"
        />
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium">Website visits</h3>
          <p className="mt-2 text-sm leading-relaxed text-title-muted">
            Full page-visit charts need analytics (e.g. Vercel Analytics or Google
            Analytics). Until then, use <strong className="text-ink">inquiry activity</strong>{' '}
            above as your engagement signal.
          </p>
          <p className="mt-4 text-3xl font-medium tabular-nums text-title-muted">—</p>
          <p className="text-xs text-title-muted">Connect analytics in a future update</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.missingHero > 0 && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {stats.missingHero} propert{stats.missingHero === 1 ? 'y' : 'ies'} still need a hero
            photo in Supabase — open Properties → Manage → upload hero.
          </p>
        )}
        {placeholderImages > 0 && (
          <Link
            to="/admin/site-images"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-ink/30"
          >
            <span className="font-medium">{placeholderImages} placeholder images</span>
            <span className="mt-1 block text-title-muted">
              See exactly where they appear on the public site →
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
