import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Development } from '../../domain/development/types'

type PropertyCardProps = {
  development: Development
  variant?: 'default' | 'featured'
  imageAspect?: 'portrait' | 'landscape' | 'tall'
}

export function PropertyCard({
  development,
  variant = 'default',
  imageAspect = 'portrait',
}: PropertyCardProps) {
  const isFeatured = variant === 'featured'
  const comingSoon = development.publicationStatus === 'coming_soon'
  const aspectClass =
    imageAspect === 'landscape'
      ? 'aspect-[16/10]'
      : imageAspect === 'tall'
        ? 'aspect-[3/4]'
        : 'aspect-[4/5]'

  return (
    <Link
      to={`/properties/${development.slug}`}
      className={`group flex flex-col ${isFeatured ? 'gap-6 lg:flex-row lg:items-stretch' : 'gap-5'}`}
    >
      <div
        className={`relative overflow-hidden bg-surface-muted ${
          isFeatured
            ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[420px] lg:flex-1'
            : aspectClass
        }`}
      >
        <img
          src={development.cardImage || development.heroImage}
          alt=""
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          loading="lazy"
          decoding="async"
        />
        <span className="text-button absolute left-4 top-4 border border-border/80 bg-surface/95 px-3 py-1.5 backdrop-blur-sm">
          {development.status}
        </span>
        {comingSoon && (
          <span className="text-button absolute right-4 top-4 border border-ink/20 bg-ink/80 px-3 py-1.5 text-surface backdrop-blur-sm">
            Coming soon
          </span>
        )}
        {development.usesIllustrativeImagery && (
          <span className="text-[10px] absolute bottom-4 left-4 uppercase tracking-wider text-surface/90 bg-ink/50 px-2 py-1">
            Illustrative
          </span>
        )}
      </div>
      <div className={isFeatured ? 'flex flex-col justify-center lg:max-w-md lg:py-4' : ''}>
        <p className="text-eyebrow text-title-muted capitalize">{development.category}</p>
        <h3
          className={`mt-2 font-medium tracking-[-0.05em] ${
            isFeatured ? 'text-display-m' : 'text-2xl md:text-3xl'
          }`}
        >
          {development.name}
        </h3>
        <p className="mt-2 text-title-muted">{development.location}</p>
        <p className="mt-2 text-sm text-ink">{development.propertyType}</p>
        {development.bedroomsRange && (
          <p className="mt-2 text-sm text-title-muted">{development.bedroomsRange}</p>
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
