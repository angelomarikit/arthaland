import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, MapPin } from 'lucide-react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import {
  filterSiteImages,
  siteImagePages,
  type SiteImageStatus,
} from '../../config/siteImageRegistry'

const statusCopy: Record<
  SiteImageStatus,
  { label: string; className: string }
> = {
  verified: {
    label: 'Verified property / brand photo',
    className: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  },
  illustrative: {
    label: 'Placeholder — not this exact building',
    className: 'bg-amber-50 text-amber-950 border-amber-200',
  },
  editorial: {
    label: 'Editorial / portfolio photo',
    className: 'bg-surface-soft text-title-muted border-border',
  },
}

export function AdminSiteImagesPage() {
  const [page, setPage] = useState('All')
  const [query, setQuery] = useState('')

  const items = useMemo(() => filterSiteImages(page, query), [page, query])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Where images appear' }]} />
      <h1 className="text-2xl font-medium tracking-tight">Website image map</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-title-muted">
        Every image below is what visitors see today. Use the{' '}
        <strong className="font-medium text-ink">Manage</strong> button to replace
        it — no technical files or JSON required.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {siteImagePages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              page === p
                ? 'border-ink bg-ink text-surface'
                : 'border-border bg-surface hover:border-ink/30'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search by page or description…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-4 w-full max-w-md rounded-xl border border-border px-3 py-2 text-sm"
      />

      <p className="mt-4 text-xs text-title-muted">
        Showing {items.length} placement{items.length === 1 ? '' : 's'}
      </p>

      <ul className="mt-6 grid gap-5 lg:grid-cols-2">
        {items.map((entry) => {
          const badge = statusCopy[entry.status]
          return (
            <li
              key={entry.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="grid sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-[4/3] bg-surface-muted sm:aspect-auto sm:min-h-[120px]">
                  <img
                    src={entry.imageUrl}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium">{entry.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-title-muted">
                    <MapPin className="size-3 shrink-0" />
                    {entry.page}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/90">
                    {entry.whereOnSite}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-lg border px-2 py-1 text-[11px] leading-snug ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  {entry.statusNote && (
                    <p className="mt-2 text-xs text-amber-900/80">{entry.statusNote}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={entry.manageHref}
                      className="rounded-xl bg-ink px-3 py-2 text-xs font-medium text-surface"
                    >
                      {entry.manageLabel}
                    </Link>
                    {entry.viewOnSiteHref && (
                      <Link
                        to={entry.viewOnSiteHref}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs hover:border-ink/30"
                      >
                        View on site
                        <ExternalLink className="size-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
