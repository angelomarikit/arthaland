import type { Amenity } from '../../domain/development/types'
import type { Development } from '../../domain/development/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

type PropertyAmenitiesSectionProps = {
  development: Development
  amenitiesRich: Amenity[]
}

export function PropertyAmenitiesSection({
  development,
  amenitiesRich,
}: PropertyAmenitiesSectionProps) {
  const hasRich = amenitiesRich.some((a) => a.imageUrl || a.description)
  const textOnly = development.amenities

  if (!hasRich && textOnly.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <Container className="section-x max-w-3xl">
          <Eyebrow>Amenities</Eyebrow>
          <h2 className="text-heading-3 mt-4">Spaces for everyday living</h2>
          <p className="mt-6 text-title-muted">
            Content will be published when available.
          </p>
        </Container>
      </section>
    )
  }

  if (hasRich) {
    return (
      <section className="py-16 md:py-24">
        <Container className="section-x">
          <FadeInWhenVisible>
            <Eyebrow>Amenities</Eyebrow>
            <h2 className="text-heading-3 mt-4">Spaces for everyday living</h2>
            <div className="mt-10 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {amenitiesRich.map((item) => (
                <article
                  key={item.id}
                  className="min-w-[280px] max-w-[320px] shrink-0 snap-start border border-border bg-surface-soft"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-surface text-xs text-title-muted">
                      Image pending
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-title-muted">{item.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </FadeInWhenVisible>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="section-x">
        <FadeInWhenVisible>
          <Eyebrow>Amenities</Eyebrow>
          <h2 className="text-heading-3 mt-4">Spaces for everyday living</h2>
          <ul className="editorial-list mt-8 max-w-2xl space-y-4 text-title-muted">
            {textOnly.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
