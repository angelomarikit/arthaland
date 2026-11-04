import { Link } from 'react-router-dom'
import type { Development } from '../../data/developments'

type PropertyCardProps = {
  development: Development
}

export function PropertyCard({ development }: PropertyCardProps) {
  return (
    <Link
      to={`/properties/${development.slug}`}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
        <img
          src={development.heroImage}
          alt=""
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <span className="text-button absolute left-4 top-4 bg-surface px-3 py-1.5">
          {development.status}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-medium tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
          {development.name}
        </h3>
        <p className="text-sm text-title-muted">{development.location}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-ink">
          <span>{development.type}</span>
          {development.bedroomsRange && (
            <>
              <span className="text-border-strong">·</span>
              <span>{development.bedroomsRange}</span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm font-medium text-ink">{development.priceLabel}</p>
        <p className="text-nav mt-3 text-ink underline-offset-4 group-hover:underline">
          View Details
        </p>
      </div>
    </Link>
  )
}
