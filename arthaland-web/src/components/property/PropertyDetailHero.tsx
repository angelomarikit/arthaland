import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../animation/gsapSetup'
import { useGsapScope } from '../../animation/useGsapScope'
import type { Development } from '../../data/developments'
import { Button } from '../ui/Button'

type PropertyDetailHeroProps = {
  development: Development
}

export function PropertyDetailHero({ development }: PropertyDetailHeroProps) {
  const ref = useRef<HTMLElement>(null)

  useGsapScope(
    ref,
    () => {
      gsap.from('[data-detail-hero-copy]', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15,
      })
    },
    [development.slug],
  )

  return (
    <section ref={ref} className="relative min-h-[72vh] overflow-hidden bg-ink text-surface">
      <img
        src={development.heroImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

      <div className="section-x relative mx-auto flex min-h-[72vh] max-w-[1200px] flex-col justify-end px-6 pb-16 pt-32 md:pb-24">
        <p data-detail-hero-copy className="text-eyebrow text-surface/70">
          {development.status}
        </p>
        <h1
          data-detail-hero-copy
          className="text-display-l mt-4 max-w-[16ch] text-surface"
        >
          {development.name}
        </h1>
        <p data-detail-hero-copy className="mt-4 text-lg text-surface/85">
          {development.location}
        </p>
        <p data-detail-hero-copy className="mt-6 max-w-2xl text-surface/75">
          {development.summary}
        </p>
        <p data-detail-hero-copy className="mt-4 text-xl font-medium">
          {development.priceLabel}
        </p>
        <div data-detail-hero-copy className="mt-8 flex flex-wrap gap-4">
          <Button href="/contact" className="bg-surface-alt text-ink hover:bg-accent">
            Request a Viewing
          </Button>
          <Link
            to={development.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-button inline-flex items-center border border-surface/40 px-6 py-4 hover:bg-surface hover:text-ink"
          >
            Official ARTHALAND Page
          </Link>
        </div>
      </div>
    </section>
  )
}
