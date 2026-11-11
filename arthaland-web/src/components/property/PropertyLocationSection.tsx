import type { Development } from '../../domain/development/types'
import type { PropertyLocationInfo } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { Button } from '../ui/Button'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

const mapsEmbedKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY as string | undefined

type PropertyLocationSectionProps = {
  development: Development
  location: PropertyLocationInfo
}

export function PropertyLocationSection({
  development,
  location,
}: PropertyLocationSectionProps) {
  const hasCoords = location.lat != null && location.lng != null
  const embedSrc =
    mapsEmbedKey && hasCoords
      ? `https://www.google.com/maps/embed/v1/place?key=${mapsEmbedKey}&q=${location.lat},${location.lng}`
      : null

  return (
    <section className="bg-ink py-16 text-surface md:py-20" id="location">
      <Container className="section-x grid gap-10 lg:grid-cols-2 lg:items-center">
        <FadeInWhenVisible>
          <Eyebrow dark>Location</Eyebrow>
          <h2 className="text-heading-3 mt-4">{development.location}</h2>
          <p className="mt-4 max-w-xl text-surface/75">
            Neighborhood context, access, and viewing arrangements — contact our sales team
            for verified details.
          </p>
          {location.directionsUrl && (
            <Button
              href={location.directionsUrl}
              variant="outlineOnDark"
              size="compact"
              className="mt-8"
            >
              Get directions
            </Button>
          )}
          {!location.directionsUrl && (
            <Button href="/contact" variant="outlineOnDark" size="compact" className="mt-8">
              Get in Touch
            </Button>
          )}
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          {embedSrc ? (
            <iframe
              title={`Map — ${development.name}`}
              src={embedSrc}
              className="aspect-[4/3] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : location.mapImageUrl ? (
            <img
              src={location.mapImageUrl}
              alt=""
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="border border-surface/20 bg-surface/5 px-8 py-16 text-center text-sm text-surface/70">
              Map content will be published when available.
            </div>
          )}
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
