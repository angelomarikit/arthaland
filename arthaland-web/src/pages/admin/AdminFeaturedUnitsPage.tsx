import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminFeaturedUnits } from '../../lib/cms/featuredUnitsApi'
import type { FeaturedUnit } from '../../domain/featuredUnit/types'

export function AdminFeaturedUnitsPage() {
  const [rows, setRows] = useState<FeaturedUnit[]>([])

  useEffect(() => {
    fetchAdminFeaturedUnits().then(setRows)
  }, [])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Featured units' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Featured units</h1>
          <p className="mt-2 max-w-xl text-sm text-title-muted">
            Marketplace listings on{' '}
            <Link to="/featured-units" className="underline" target="_blank" rel="noreferrer">
              /featured-units
            </Link>
            . Add photos, pricing, and unit details for buyers.
          </p>
        </div>
        <Link
          to="/admin/featured-units/new"
          className="rounded-xl bg-ink px-4 py-2.5 text-sm text-surface"
        >
          Add listing
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {rows.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              {u.heroImage ? (
                <img src={u.heroImage} alt="" className="size-16 shrink-0 object-cover" />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center bg-surface-soft text-xs text-title-muted">
                  No photo
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium">{u.title}</p>
                <p className="text-sm text-title-muted">
                  {u.developmentName} · {u.priceLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-title-muted">
                {u.published ? 'Published' : 'Draft'} · {u.status}
              </span>
              <Link to={`/admin/featured-units/${u.id}`} className="underline">
                Edit
              </Link>
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-8 text-sm text-title-muted">
            No listings yet. Run migration <code>004_featured_units.sql</code> in Supabase, then
            click Add listing.
          </li>
        )}
      </ul>
    </div>
  )
}
