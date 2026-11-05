import { sectionImages } from '../../config/sectionImages'
import { usePageSection } from '../../contexts/PageContentContext'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const stats = [
  { label: 'Water savings (portfolio highlight)', value: '34%' },
  { label: 'Energy savings (portfolio highlight)', value: '54%' },
  { label: 'GHG emissions avoided', value: '97%' },
  { label: 'Net zero portfolio target', value: '2030' },
]

/** Static layout — width/height scrub caused layout thrashing during scroll. */
export function SustainabilityExpandSection() {
  const copy = usePageSection('sustainability')
  const imageSrc = copy.imageUrl ?? sectionImages.sustainability
  return (
    <section className="relative bg-surface-soft py-24 md:py-32">
      <Container className="section-x mb-10 lg:hidden">
        <Eyebrow>{copy.eyebrow ?? 'Sustainability'}</Eyebrow>
        <h2 className="text-heading-2 mt-4 max-w-[18ch]">
          {copy.title ?? 'Certified developments with measurable environmental performance'}
        </h2>
        <p className="mt-4 text-title-muted">
          {copy.body ??
            'Figures below are corporate portfolio highlights (December 2025).'}
        </p>
      </Container>

      <Container className="section-x flex justify-center">
        <div className="relative mx-auto w-full overflow-hidden lg:min-h-[min(85vh,720px)]">
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="relative flex min-h-[min(52vh,480px)] flex-col justify-end p-8 text-surface md:p-14 lg:min-h-[min(85vh,720px)]">
            <Eyebrow dark>{copy.eyebrow ?? 'Sustainability'}</Eyebrow>
            <h2 className="text-heading-2 mt-4 max-w-[18ch] max-lg:hidden">
              {copy.title ?? 'Certified developments with measurable environmental performance'}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-surface/85 md:text-base">
              {copy.body ??
                'Figures below are corporate portfolio highlights (December 2025). Individual projects may exceed these targets.'}
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-sm text-surface/70">{stat.label}</p>
                  <p className="text-display-m mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <Container className="section-x mt-12 lg:hidden">
        <div className="grid gap-8 sm:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="border-t border-border pt-4">
              <p className="text-sm text-title-muted">{stat.label}</p>
              <p className="text-display-m mt-2 text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
