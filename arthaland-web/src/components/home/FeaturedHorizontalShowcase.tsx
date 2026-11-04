import { Link } from 'react-router-dom'
import { getPublishedDevelopments } from '../../data/developments'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const featured = getPublishedDevelopments()
  .filter((d) => d.featured)
  .slice(0, 5)

/**
 * Premium horizontal gallery without ScrollTrigger pin.
 * Native scroll-snap keeps cards visible and avoids pin/blackout failures with Lenis.
 */
export function FeaturedHorizontalShowcase() {
  return (
    <section className="bg-ink text-surface py-20 md:py-24 xl:py-28">
      <Container className="section-x">
        <Eyebrow dark>Featured developments</Eyebrow>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-heading-2 max-w-[14ch]">Scroll the portfolio</h2>
          <p className="text-sm text-[#bababa]">
            {featured.length} featured developments · swipe on mobile
          </p>
        </div>
      </Container>

      <div
        data-lenis-prevent
        className="section-x mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:thin] lg:mt-12 lg:gap-10 lg:pb-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface/30"
        aria-label="Featured developments gallery"
      >
        {featured.map((dev, index) => (
          <FeaturedCard key={dev.slug} dev={dev} index={index} />
        ))}
      </div>
    </section>
  )
}

type FeaturedCardProps = {
  dev: (typeof featured)[number]
  index: number
}

function FeaturedCard({ dev, index }: FeaturedCardProps) {
  const eager = index < 2

  return (
    <article className="group w-[min(88vw,420px)] shrink-0 snap-center lg:w-[min(38vw,560px)] lg:snap-start">
      <Link to={`/properties/${dev.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#1e1e1e]">
          <img
            src={dev.heroImage}
            alt=""
            className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={eager ? 'high' : 'auto'}
          />
          <span className="text-button absolute left-4 top-4 bg-surface px-3 py-1.5 text-ink">
            {dev.status}
          </span>
        </div>
        <div className="mt-6 flex items-start justify-between gap-4 border-t border-border-on-dark pt-6">
          <div>
            <p className="text-sm text-[#bababa]">
              {String(index + 1).padStart(2, '0')} · {dev.region}
            </p>
            <h3 className="text-heading-3 mt-2">{dev.name}</h3>
            <p className="mt-1 text-sm text-[#bababa]">{dev.location}</p>
          </div>
          <span className="text-nav text-accent transition-transform group-hover:translate-x-1">
            View →
          </span>
        </div>
      </Link>
    </article>
  )
}
