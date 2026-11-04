import { useParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyDetailHero } from '../components/property/PropertyDetailHero'
import { getDevelopment, getPublishedDevelopments } from '../data/developments'

export function PropertyDetailPage() {
  const { slug } = useParams()
  const development = slug ? getDevelopment(slug) : undefined

  if (!development) {
    return (
      <>
        <SiteHeader />
        <Container className="section-x py-32">
          <h1 className="text-heading-2">Development not found</h1>
          <p className="mt-4 text-title-muted">
            This listing is unpublished or unavailable.
          </p>
          <Button href="/properties" className="mt-8">
            Back to Properties
          </Button>
        </Container>
      </>
    )
  }

  const related = getPublishedDevelopments()
    .filter((d) => d.slug !== development.slug && d.region === development.region)
    .slice(0, 3)

  return (
    <>
      <SiteHeader embedded />
      <PropertyDetailHero development={development} />

      <section className="section-x py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-heading-3">Overview</h2>
            <p className="mt-4 text-title-muted leading-relaxed">
              {development.overview}
            </p>
            {development.sourceNote && (
              <p className="mt-4 text-sm text-title-muted">{development.sourceNote}</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">Development facts</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-title-muted">Type</dt>
                <dd>{development.type}</dd>
              </div>
              {development.bedroomsRange && (
                <div>
                  <dt className="text-title-muted">Unit types</dt>
                  <dd>{development.bedroomsRange}</dd>
                </div>
              )}
              {development.areaRange && (
                <div>
                  <dt className="text-title-muted">Area range</dt>
                  <dd>{development.areaRange}</dd>
                </div>
              )}
            </dl>
          </div>
        </Container>
      </section>

      <section className="bg-surface-soft py-16">
        <Container className="section-x grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-heading-3">Amenities</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-title-muted">
              {development.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-heading-3">Sustainability</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-title-muted">
              {development.sustainability.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {development.gallery.length > 1 && (
        <section className="section-x py-16">
          <Container>
            <h2 className="text-heading-3">Gallery</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {development.gallery.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-border py-16">
          <Container className="section-x">
            <h2 className="text-heading-3">Related developments</h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <PropertyCard key={d.slug} development={d} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
