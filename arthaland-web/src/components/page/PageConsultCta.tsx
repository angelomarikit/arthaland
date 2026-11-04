import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { sectionImages } from '../../config/sectionImages'

type PageConsultCtaProps = {
  eyebrow?: string
  title?: string
  body?: string
}

export function PageConsultCta({
  eyebrow = 'Consultation',
  title = 'Explore properties or request a viewing',
  body = 'Our sales team can share verified development information, coordinate show suites where available, and guide your next steps.',
}: PageConsultCtaProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-surface">
      <img
        src={sectionImages.closingCta}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-40"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-ink/60" />
      <Container className="section-x relative py-20 text-center md:py-28">
        <p className="text-eyebrow text-surface/70">{eyebrow}</p>
        <h2 className="text-heading-2 mx-auto mt-4 max-w-[20ch] text-surface">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-surface/80">{body}</p>
        <Button
          href="/contact"
          className="mt-10 bg-surface-alt text-ink hover:bg-accent hover:text-ink"
        >
          Get in Touch
        </Button>
      </Container>
    </section>
  )
}
