import type { Development } from '../../domain/development/types'
import type { PropertyLocationInfo } from '../../domain/propertyDetail/types'
import {
  googleMapsEmbedSrc,
  isGoogleMapsLink,
  isUploadedMapImageUrl,
} from '../../lib/maps/googleMaps'
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
  const googleLink =
    location.directionsUrl && isGoogleMapsLink(location.directionsUrl)
      ? location.directionsUrl
      : location.mapUrl && isGoogleMapsLink(location.mapUrl)
        ? location.mapUrl
        : undefined

  const embedSrc = googleMapsEmbedSrc({
    googleMapsLink: googleLink,
    lat: location.lat,
    lng: location.lng,
    embedApiKey: mapsEmbedKey,
  })

  const mapImage =
    location.mapImageUrl && isUploadedMapImageUrl(location.mapImageUrl)
      ? location.mapImageUrl
      : undefined

  const openMapsHref = googleLink ?? location.directionsUrl

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
          {openMapsHref ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={openMapsHref} variant="outlineOnDark" size="compact">
                Open in Google Maps
              </Button>
            </div>
          ) : (
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
              className="aspect-[4/3] w-full border-0 bg-surface/10"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : mapImage ? (
            <a
              href={openMapsHref ?? mapImage}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <img
                src={mapImage}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </a>
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
