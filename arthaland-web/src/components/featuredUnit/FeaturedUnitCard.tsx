import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { FeaturedUnit } from '../../domain/featuredUnit/types'

type FeaturedUnitCardProps = {
  unit: FeaturedUnit
}

export function FeaturedUnitCard({ unit }: FeaturedUnitCardProps) {
  const statusLabel =
    unit.status === 'reserved' ? 'Reserved' : unit.status === 'sold' ? 'Sold' : 'Available'

  return (
    <Link
      to={`/featured-units/${unit.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-border bg-surface transition-colors hover:border-ink/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {unit.heroImage ? (
          <img
            src={unit.heroImage}
            alt=""
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-title-muted">
            Photo coming soon
          </div>
        )}
        <span className="text-button absolute left-4 top-4 border border-border/80 bg-surface/95 px-3 py-1.5 backdrop-blur-sm">
          {statusLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-eyebrow text-title-muted">{unit.developmentName}</p>
        <h3 className="text-heading-3 mt-2 line-clamp-2">{unit.title}</h3>
        <p className="mt-2 text-sm text-title-muted">{unit.location}</p>
        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-title-muted">
          {unit.unitLabel ? (
            <div>
              <dt className="sr-only">Unit type</dt>
              <dd>{unit.unitLabel}</dd>
            </div>
          ) : null}
          {unit.areaSqm ? (
            <div>
              <dt className="sr-only">Area</dt>
              <dd>{unit.areaSqm} sqm</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-4 text-lg font-medium tracking-[-0.02em] text-ink">{unit.priceLabel}</p>
        <span className="text-nav mt-auto inline-flex items-center gap-2 pt-6 text-ink transition-transform group-hover:translate-x-0.5">
          View listing
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
