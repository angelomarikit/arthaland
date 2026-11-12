import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Development } from '../../domain/development/types'

type PropertyFeaturedVerticalCardProps = {
  development: Development
}

/** Narrow sidebar card for featured developments on property detail. */
export function PropertyFeaturedVerticalCard({
  development,
}: PropertyFeaturedVerticalCardProps) {
  return (
    <Link
      to={`/properties/${development.slug}`}
      className="group flex gap-4 border border-border bg-surface p-3 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-surface-muted sm:w-28">
        <img
          src={development.cardImage || development.heroImage}
          alt=""
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-1 top-1 max-w-[90%] truncate border border-border/80 bg-surface/95 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          {development.status}
        </span>
      </div>
      <div className="min-w-0 flex-1 py-1">
        <p className="text-[10px] uppercase tracking-wider text-title-muted capitalize">
          {development.category}
        </p>
        <h3 className="mt-1 truncate text-base font-medium">{development.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-title-muted">{development.location}</p>
        <p className="mt-1 text-xs text-ink">{development.propertyType}</p>
        <p className="mt-1 text-xs font-medium">{development.priceLabel}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-ink">
          Explore
          <ArrowUpRight className="size-3" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
