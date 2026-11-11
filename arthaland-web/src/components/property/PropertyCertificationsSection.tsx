import type { PropertyCertification } from '../../domain/propertyDetail/types'
import { CERTIFICATION_STATUS_LABEL } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

type PropertyCertificationsSectionProps = {
  items: PropertyCertification[]
}

export function PropertyCertificationsSection({
  items,
}: PropertyCertificationsSectionProps) {
  if (items.length === 0) {
    return (
      <section className="border-y border-border bg-surface-soft py-16 md:py-20">
        <Container className="section-x max-w-3xl">
          <Eyebrow>Sustainability</Eyebrow>
          <h2 className="text-heading-3 mt-4">Certifications</h2>
          <p className="mt-4 text-title-muted">
            Content will be published when available.
          </p>
        </Container>
      </section>
    )
  }

  return (
    <section className="border-y border-border bg-surface-soft py-16 md:py-24">
      <Container className="section-x">
        <FadeInWhenVisible>
          <Eyebrow>Sustainability</Eyebrow>
          <h2 className="text-heading-3 mt-4">Certifications & standards</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((cert) => (
              <li
                key={cert.id}
                className="flex flex-col border border-border bg-surface p-6"
              >
                {cert.logoUrl ? (
                  <img
                    src={cert.logoUrl}
                    alt=""
                    className="h-12 w-auto max-w-[160px] object-contain object-left"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-medium uppercase tracking-wider text-title-muted">
                    Logo pending
                  </span>
                )}
                <p className="mt-4 text-lg font-medium">{cert.name}</p>
                <span className="mt-2 inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider">
                  {CERTIFICATION_STATUS_LABEL[cert.status]}
                </span>
              </li>
            ))}
          </ul>
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
