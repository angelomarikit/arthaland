import type { Development } from '../../domain/development/types'
import type { PropertySpecs } from '../../domain/propertyDetail/types'
import { Button } from '../ui/Button'

type PropertyDetailHeroProps = {
  development: Development
  specs?: PropertySpecs
}

export function PropertyDetailHero({ development, specs }: PropertyDetailHeroProps) {
  return (
    <section className="hero-under-header relative min-h-[72vh] overflow-hidden bg-ink text-surface">
      <img
        src={development.heroImage}
        alt=""
        className="absolute inset-0 size-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

      <div className="section-x relative mx-auto flex min-h-[72vh] max-w-[1200px] flex-col justify-end px-6 pb-16 pt-32 md:pb-24">
        <p className="text-eyebrow animate-fade-up text-surface/70">
          {development.status} · {development.type}
        </p>
        {development.turnoverSchedule?.summary && (
          <p className="mt-3 animate-fade-up text-sm text-surface/80 animation-delay-150">
            {development.turnoverSchedule.summary}
          </p>
        )}
        <h1 className="text-display-l mt-4 max-w-[16ch] animate-fade-up animation-delay-150">
          {development.name}
        </h1>
        {specs?.heroSubtitle && (
          <p className="mt-3 max-w-2xl animate-fade-up text-lg text-surface/90 animation-delay-150">
            {specs.heroSubtitle}
          </p>
        )}
        <p className="mt-4 animate-fade-up text-lg text-surface/85 animation-delay-150">
          {development.location}
        </p>
        <p className="mt-6 max-w-2xl animate-fade-up text-surface/75 animation-delay-150">
          {development.summary}
        </p>
        <p className="mt-4 animate-fade-up text-xl font-medium animation-delay-150">
          {development.priceLabel}
        </p>
        <div className="mt-8 flex animate-fade-up flex-wrap gap-4 animation-delay-150">
          <Button href="#gallery" variant="outlineOnDark">
            View gallery
          </Button>
          <Button href="#inquiry">Inquire</Button>
        </div>
      </div>
    </section>
  )
}
