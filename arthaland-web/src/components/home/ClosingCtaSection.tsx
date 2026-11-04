import { Button } from '../ui/Button'
import { sectionImages } from '../../config/sectionImages'
import { usePageSection } from '../../contexts/PageContentContext'
import { titleToDisplayLines } from '../../lib/cms/pageContentMerge'
import { SplitTextReveal } from '../motion/SplitTextReveal'

export function ClosingCtaSection() {
  const copy = usePageSection('closing-cta')
  const lines = titleToDisplayLines(copy.title, ['Begin your', 'ARTHALAND inquiry'])
  const bg = copy.imageUrl ?? sectionImages.closingCta
  return (
    <section className="relative overflow-hidden bg-ink text-surface">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bg}
          alt=""
          className="size-full object-cover opacity-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/55" />
      </div>

      <div className="section-x relative px-6 py-28 text-center md:py-36 lg:px-20">
        <SplitTextReveal
          as="h2"
          lines={lines}
          className="text-display-l mx-auto max-w-[12ch] text-surface"
          lineClassName="text-display-l"
          triggerStart="top 88%"
        />
        <p className="mx-auto mt-8 max-w-lg text-surface/85 whitespace-pre-line">
          {copy.body ??
            'Request a viewing or send a message — our sales team will respond with verified development information.'}
        </p>
        <Button href="/contact" className="mt-10">
          Get in Touch
        </Button>
      </div>
    </section>
  )
}
