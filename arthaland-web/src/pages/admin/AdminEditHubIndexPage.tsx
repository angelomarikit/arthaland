import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminDevelopments } from '../../lib/cms/developmentsApi'
import { fetchAdminPages } from '../../lib/cms/pagesApi'

export function AdminEditHubIndexPage() {
  const [pages, setPages] = useState<{ slug: string; title: string }[]>([])
  const [properties, setProperties] = useState<{ slug: string; name: string }[]>([])

  useEffect(() => {
    fetchAdminPages().then((rows) =>
      setPages(rows.map((p) => ({ slug: p.slug, title: p.title }))),
    )
    fetchAdminDevelopments().then((rows) =>
      setProperties(rows.map((d) => ({ slug: d.slug, name: d.name }))),
    )
  }, [])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Edit website' }]} />
      <h1 className="text-2xl font-medium">Edit website map</h1>
      <p className="mt-2 max-w-2xl text-sm text-title-muted">
        Pick a page below to see every section visitors see — with Edit links in order. Read the{' '}
        <Link to="/admin/content-guide" className="underline">
          content guide
        </Link>{' '}
        for publish rules.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">Homepage</h2>
        <Link
          to="/admin/edit/site/home"
          className="mt-3 block rounded-2xl border border-border bg-surface px-5 py-4 hover:border-ink/30"
        >
          <p className="font-medium">Home</p>
          <p className="text-sm text-title-muted">Hero, introduction, gallery, lifestyle, inquiry…</p>
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">
          Marketing pages
        </h2>
        <ul className="mt-3 space-y-2">
          {pages
            .filter((p) => p.slug !== 'home')
            .map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/admin/edit/site/${p.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl border border-border bg-surface px-5 py-4 hover:border-ink/30"
                >
                  <span className="font-medium">{p.title}</span>
                  <span className="text-xs text-title-muted">/{p.slug}</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">
          Property pages
        </h2>
        <ul className="mt-3 space-y-2">
          {properties.map((d) => (
            <li key={d.slug}>
              <Link
                to={`/admin/edit/property/${d.slug}`}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl border border-border bg-surface px-5 py-4 hover:border-ink/30"
              >
                <span className="font-medium">{d.name}</span>
                <span className="text-xs text-title-muted">/properties/{d.slug}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}