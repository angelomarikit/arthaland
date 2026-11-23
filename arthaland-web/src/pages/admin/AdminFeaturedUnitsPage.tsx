import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminSortableList } from '../../components/admin/AdminSortableList'
import {
  fetchAdminFeaturedUnits,
  patchFeaturedUnitDisplayOrder,
} from '../../lib/cms/featuredUnitsApi'
import type { FeaturedUnit } from '../../domain/featuredUnit/types'

export function AdminFeaturedUnitsPage() {
  const [rows, setRows] = useState<FeaturedUnit[]>([])

  async function reload() {
    setRows(await fetchAdminFeaturedUnits())
  }

  useEffect(() => {
    void reload()
  }, [])

  const sortableRows = rows.filter((u) => !u.isSampleGuide)
  const sampleRows = rows.filter((u) => u.isSampleGuide)

  function renderListingRow(u: FeaturedUnit, handle?: ReactNode) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-4">
          {handle ? <div className="shrink-0">{handle}</div> : null}
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
          {u.isSampleGuide ? (
            <Link
              to={`/featured-units/${u.slug}`}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              View on site
            </Link>
          ) : (
            <Link to={`/admin/featured-units/${u.id}`} className="underline">
              Edit
            </Link>
          )}
        </div>
      </div>
    )
  }

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
            . Drag ⋮⋮ to control order on the public page.
          </p>
        </div>
        <Link
          to="/admin/featured-units/new"
          className="rounded-xl bg-ink px-4 py-2.5 text-sm text-surface"
        >
          Add listing
        </Link>
      </div>

      {sortableRows.length > 0 ? (
        <AdminSortableList
          className="mt-8 space-y-3"
          itemClassName="rounded-2xl border border-border bg-surface"
          items={sortableRows}
          onReorder={(next) => {
            void patchFeaturedUnitDisplayOrder(next.map((u) => u.id)).then(reload)
          }}
          renderItem={(u, handle) => renderListingRow(u, handle)}
        />
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-border p-8 text-sm text-title-muted">
          No CMS listings yet. Run migration <code>004_featured_units.sql</code> in Supabase, then
          click Add listing.
        </p>
      )}

      {sampleRows.length > 0 ? (
        <>
          <h2 className="mt-10 text-sm font-medium text-title-muted">Format examples (read-only)</h2>
          <ul className="mt-4 space-y-3">
            {sampleRows.map((u) => (
              <li key={u.id} className="rounded-2xl border border-border bg-surface">
                {renderListingRow(u)}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}