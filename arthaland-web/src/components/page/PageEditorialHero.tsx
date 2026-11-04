import { SiteHeader } from '../layout/SiteHeader'
import { Eyebrow } from '../ui/Eyebrow'
import { Container } from '../ui/Container'

type PageEditorialHeroProps = {
  image: string
  eyebrow: string
  title: string | string[]
  description?: string
  embeddedHeader?: boolean
  minHeightClass?: string
}

export function PageEditorialHero({
  image,
  eyebrow,
  title,
  description,
  embeddedHeader = false,
  minHeightClass = 'min-h-[62vh] md:min-h-[72vh]',
}: PageEditorialHeroProps) {
  const lines = Array.isArray(title) ? title : [title]

  return (
    <>
      <SiteHeader embedded={embeddedHeader} />
      <section
        className={`${embeddedHeader ? 'hero-under-header ' : ''}relative overflow-hidden bg-ink text-surface ${minHeightClass}`}
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <Container
          className={`section-x relative flex ${minHeightClass} flex-col justify-end pb-16 pt-28 md:pb-24 md:pt-36`}
        >
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[14ch] animate-fade-up">
            {lines.map((line, i) => (
              <span key={line} className={i > 0 ? 'block' : undefined}>
                {line}
              </span>
            ))}
          </h1>
          {description && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-surface/80 animate-fade-up animation-delay-150">
              {description}
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
