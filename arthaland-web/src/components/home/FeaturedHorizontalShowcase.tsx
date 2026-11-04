import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../animation/gsapSetup'
import { breakpoints, scrollScrub } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { getPublishedDevelopments } from '../../data/developments'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const featured = getPublishedDevelopments()
  .filter((d) => d.featured)
  .slice(0, 5)

export function FeaturedHorizontalShowcase() {
  /** Pins full viewport panel (header + track) so scroll never shows empty black. */
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGsapScope(
    pinRef,
    () => {
      const mm = gsap.matchMedia()

      mm.add(breakpoints.desktop, () => {
        const track = trackRef.current
        const pin = pinRef.current
        if (!track || !pin) return

        const getScrollDistance = () => {
          const gutter = 80
          return Math.max(0, track.scrollWidth - window.innerWidth + gutter)
        }

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: scrollScrub.firm,
            invalidateOnRefresh: true,
            anticipatePin: 0,
          },
        })
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.from('[data-mobile-card]', {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top 85%',
          },
        })
      })
    },
    [],
  )

  return (
    <section className="bg-ink text-surface">
      {/* Mobile: static stack (no pin) */}
      <div className="lg:hidden">
        <Container className="section-x pt-20 md:pt-28">
          <Eyebrow dark>Featured developments</Eyebrow>
          <h2 className="text-heading-2 mt-4 max-w-[14ch]">Scroll the portfolio</h2>
        </Container>
        <div className="flex flex-col gap-10 px-6 pb-16 pt-10">
          {featured.map((dev, index) => (
            <FeaturedCard key={dev.slug} dev={dev} index={index} />
          ))}
        </div>
      </div>

      {/* Desktop: full-viewport pin panel */}
      <div
        ref={pinRef}
        className="relative hidden min-h-svh w-full overflow-hidden bg-ink lg:block"
      >
        <Container className="section-x pt-20 xl:pt-28">
          <Eyebrow dark>Featured developments</Eyebrow>
          <div className="mt-4 flex items-end justify-between gap-6">
            <h2 className="text-heading-2 max-w-[14ch]">Scroll the portfolio</h2>
            <p className="text-sm text-[#bababa]">
              {featured.length} featured developments
            </p>
          </div>
        </Container>

        <div className="mt-8 flex min-h-[calc(100svh-220px)] items-center overflow-hidden pb-16 xl:mt-12">
          <div
            ref={trackRef}
            className="flex w-max gap-8 px-10 xl:px-20"
          >
            {featured.map((dev, index) => (
              <FeaturedCard key={dev.slug} dev={dev} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type FeaturedCardProps = {
  dev: (typeof featured)[number]
  index: number
}

function FeaturedCard({ dev, index }: FeaturedCardProps) {
  return (
    <article
      data-mobile-card
      className="group relative w-[min(88vw,420px)] shrink-0 lg:w-[min(38vw,560px)]"
    >
      <Link to={`/properties/${dev.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#1e1e1e]">
          <img
            src={dev.heroImage}
            alt=""
            className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            loading="lazy"
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
