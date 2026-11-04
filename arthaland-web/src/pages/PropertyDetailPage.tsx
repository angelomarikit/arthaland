import { useParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyDetailHero } from '../components/property/PropertyDetailHero'
import { PropertyGallery } from '../components/property/PropertyGallery'
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

  const fallbackRelated = getPublishedDevelopments()
    .filter((d) => d.slug !== development.slug)
    .slice(0, 3)

  const relatedList = related.length > 0 ? related : fallbackRelated

  return (
    <>
      <SiteHeader embedded />
      <PropertyDetailHero development={development} />

      <section className="py-16 md:py-24">
        <Container className="section-x grid gap-12 lg:grid-cols-12">
          <FadeInWhenVisible className="lg:col-span-7">
            <Eyebrow>Introduction</Eyebrow>
            <h2 className="text-heading-3 mt-4">A considered address in {development.region}</h2>
            <p className="mt-6 leading-relaxed text-title-muted">{development.overview}</p>
            {development.sourceNote && (
              <p className="mt-6 border-l-2 border-border pl-4 text-sm text-title-muted">
                {development.sourceNote}
              </p>
            )}
          </FadeInWhenVisible>
          <FadeInWhenVisible className="lg:col-span-5">
            <div className="border border-border bg-surface-soft p-8 md:p-10">
              <h3 className="text-lg font-medium">Development highlights</h3>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-title-muted">Location</dt>
                  <dd className="mt-1 text-base">{development.location}</dd>
                </div>
                <div>
                  <dt className="text-title-muted">Category</dt>
                  <dd className="mt-1 text-base">{development.type}</dd>
                </div>
                <div>
                  <dt className="text-title-muted">Status</dt>
                  <dd className="mt-1 text-base">{development.status}</dd>
                </div>
                {development.bedroomsRange && (
                  <div>
                    <dt className="text-title-muted">Residences</dt>
                    <dd className="mt-1 text-base">{development.bedroomsRange}</dd>
                  </div>
                )}
                {development.areaRange && (
                  <div>
                    <dt className="text-title-muted">Area range (published)</dt>
                    <dd className="mt-1 text-base">{development.areaRange}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-title-muted">Pricing</dt>
                  <dd className="mt-1 text-base font-medium">{development.priceLabel}</dd>
                </div>
              </dl>
            </div>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-soft py-16 md:py-24">
        <Container className="section-x">
          <FadeInWhenVisible>
            <Eyebrow>Gallery</Eyebrow>
            <h2 className="text-heading-3 mt-4">Architecture & environment</h2>
            <div className="mt-10">
              <PropertyGallery
                images={development.gallery}
                developmentName={development.name}
              />
            </div>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x grid gap-16 lg:grid-cols-2">
          <FadeInWhenVisible>
            <Eyebrow>Amenities & lifestyle</Eyebrow>
            <h2 className="text-heading-3 mt-4">Spaces for everyday living</h2>
            <ul className="editorial-list mt-8 space-y-4 text-title-muted">
              {development.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <Eyebrow>Sustainability</Eyebrow>
            <h2 className="text-heading-3 mt-4">Verified commitments</h2>
            <ul className="editorial-list mt-8 space-y-4 text-title-muted">
              {development.sustainability.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="bg-ink py-16 text-surface md:py-20">
        <Container className="section-x grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Eyebrow dark>Location</Eyebrow>
            <h2 className="text-heading-3 mt-4">{development.location}</h2>
            <p className="mt-4 max-w-xl text-surface/75">
              Situated in {development.region}. For maps, transport links, and
              neighborhood context, refer to the official ARTHALAND development
              page or speak with our sales team.
            </p>
          </div>
          <div className="flex items-end">
            <Button
              href={development.officialUrl}
              className="border border-surface/30 bg-transparent text-surface hover:bg-surface hover:text-ink"
            >
              View on arthaland.com
            </Button>
          </div>
        </Container>
      </section>

      {relatedList.length > 0 && (
        <section className="border-t border-border py-16 md:py-24">
          <Container className="section-x">
            <Eyebrow>Discover more</Eyebrow>
            <h2 className="text-heading-3 mt-4">Related developments</h2>
            <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {relatedList.map((d) => (
                <FadeInWhenVisible key={d.slug}>
                  <PropertyCard development={d} />
                </FadeInWhenVisible>
              ))}
            </div>
          </Container>
        </section>
      )}

      <PageConsultCta
        title={`Inquire about ${development.name}`}
        body="Share your questions or request a viewing. Our sales team responds with verified information from ARTHALAND."
      />
    </>
  )
}
