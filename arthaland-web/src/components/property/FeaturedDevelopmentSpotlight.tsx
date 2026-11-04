import { Link } from 'react-router-dom'
import type { Development } from '../../data/developments'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

type FeaturedDevelopmentSpotlightProps = {
  development: Development
}

export function FeaturedDevelopmentSpotlight({
  development,
}: FeaturedDevelopmentSpotlightProps) {
  return (
    <article className="group relative overflow-hidden bg-ink text-surface">
      <div className="grid lg:grid-cols-12">
        <div className="relative aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[480px]">
          <img
            src={development.heroImage}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/30 to-transparent lg:hidden" />
        </div>
        <div className="flex flex-col justify-center px-6 py-12 lg:col-span-5 lg:px-12 lg:py-16">
          <Eyebrow dark>Featured development</Eyebrow>
          <h2 className="text-display-m mt-4 max-w-[12ch]">{development.name}</h2>
          <p className="mt-3 text-surface/75">{development.location}</p>
          <p className="text-nav mt-2 text-surface/60">
            {development.type} · {development.status}
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-surface/80">
            {development.summary}
          </p>
          <p className="mt-4 text-sm font-medium text-surface">{development.priceLabel}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              href={`/properties/${development.slug}`}
              className="bg-surface-alt text-ink hover:bg-accent"
            >
              Explore Development
            </Button>
            <Link
              to={development.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-button inline-flex items-center border border-surface/35 px-6 py-4 transition-colors hover:bg-surface hover:text-ink"
            >
              Official page
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
