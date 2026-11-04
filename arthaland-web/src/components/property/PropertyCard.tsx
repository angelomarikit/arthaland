import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Development } from '../../data/developments'

type PropertyCardProps = {
  development: Development
  variant?: 'default' | 'featured'
}

export function PropertyCard({
  development,
  variant = 'default',
}: PropertyCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <Link
      to={`/properties/${development.slug}`}
      className={`group flex flex-col ${isFeatured ? 'gap-6 lg:flex-row lg:items-stretch' : 'gap-5'}`}
    >
      <div
        className={`relative overflow-hidden bg-surface-muted ${
          isFeatured
            ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[360px] lg:flex-1'
            : 'aspect-[4/5]'
        }`}
      >
        <img
          src={development.heroImage}
          alt=""
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          loading="lazy"
          decoding="async"
        />
        <span className="text-button absolute left-4 top-4 border border-border/80 bg-surface/95 px-3 py-1.5 backdrop-blur-sm">
          {development.status}
        </span>
      </div>
      <div className={isFeatured ? 'flex flex-col justify-center lg:max-w-sm lg:py-4' : ''}>
        <p className="text-eyebrow text-title-muted">{development.type}</p>
        <h3
          className={`mt-2 font-medium tracking-[-0.05em] ${
            isFeatured ? 'text-display-m' : 'text-2xl md:text-3xl'
          }`}
        >
          {development.name}
        </h3>
        <p className="mt-2 text-title-muted">{development.location}</p>
        {development.bedroomsRange && (
          <p className="mt-3 text-sm text-ink">{development.bedroomsRange}</p>
        )}
        <p className="mt-2 text-sm font-medium">{development.priceLabel}</p>
        <span className="text-nav mt-5 inline-flex items-center gap-2 text-ink transition-transform group-hover:translate-x-0.5">
          Explore Property
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
