import { useParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyDetailHero } from '../components/property/PropertyDetailHero'
import { PropertyFloorPlansSection } from '../components/property/PropertyFloorPlansSection'
import { PropertyGallery } from '../components/property/PropertyGallery'
import { PropertyUnitTypesSection } from '../components/property/PropertyUnitTypesSection'
import { PropertyVideoSection } from '../components/property/PropertyVideoSection'
import { isSoldOutDevelopment } from '../config/developments'
import { getPortfolioDevelopments, getUnitTypesByDevelopment } from '../data/repositories/developmentRepository'
import { usePublicDevelopment, usePublicDevelopmentsList } from '../hooks/usePublicDevelopments'

export function PropertyDetailPage() {
  const { slug } = useParams()
  const { development, state } = usePublicDevelopment(slug)
  const { items: portfolioList } = usePublicDevelopmentsList()

  if (state === 'loading') {
    return (
      <>
        <SiteHeader />
        <Container className="section-x py-32">
          <p className="text-title-muted">Loading development…</p>
        </Container>
      </>
    )
  }

  if (!development || (slug && isSoldOutDevelopment(slug))) {
    return (
      <>
        <SiteHeader />
        <Container className="section-x py-32">
          <h1 className="text-heading-2">Development not found</h1>
          <p className="mt-4 text-title-muted">
            This listing is sold out, unpublished, or unavailable on the sales
            channel.
          </p>
          <Button href="/properties" className="mt-8">
            Back to Properties
          </Button>
        </Container>
      </>
    )
  }

  const units = getUnitTypesByDevelopment(development.id)
  const list = portfolioList.length ? portfolioList : getPortfolioDevelopments()
  const related = list
    .filter(
      (d) =>
        d.slug !== development.slug &&
        d.publicationStatus === 'published' &&
        d.region === development.region,
    )
    .slice(0, 3)
  const fallbackRelated = list
    .filter(
      (d) => d.slug !== development.slug && d.publicationStatus === 'published',
    )
    .slice(0, 3)
  const relatedList = related.length > 0 ? related : fallbackRelated

  return (
    <>
      <SiteHeader embedded />
      <PropertyDetailHero development={development} />

      {development.publicationStatus === 'coming_soon' && (
        <div className="border-b border-border bg-surface-soft py-4">
          <Container className="section-x text-center text-sm text-title-muted">
            Full sales listing coming soon — contact the team for verified
            information in the meantime.
          </Container>
        </div>
      )}

      {development.publicationStatus === 'draft' && (
        <div className="border-b border-border bg-surface-soft py-4">
          <Container className="section-x text-center text-sm text-title-muted">
            This development profile is in preparation. Verified specifications
            and photography will be published when available — inquire for
            current information.
          </Container>
        </div>
      )}

      {development.usesIllustrativeImagery && (
        <div className="border-b border-amber-200/80 bg-amber-50 py-3">
          <Container className="section-x text-center text-xs uppercase tracking-wider text-amber-950/80">
            Illustrative imagery — not verified photography of {development.name}
          </Container>
        </div>
      )}

      <section className="py-16 md:py-24">
        <Container className="section-x grid gap-12 lg:grid-cols-12">
          <FadeInWhenVisible className="lg:col-span-7">
            <Eyebrow>Introduction</Eyebrow>
            <h2 className="text-heading-3 mt-4">
              A considered address in {development.region}
            </h2>
            <p className="mt-6 leading-relaxed text-title-muted">
              {development.fullDescription}
            </p>
            {development.sourceNote && (
              <p className="mt-6 border-l-2 border-border pl-4 text-sm text-title-muted">
                {development.sourceNote}
              </p>
            )}
          </FadeInWhenVisible>
          <FadeInWhenVisible className="lg:col-span-5">
            <div className="border border-border bg-surface-soft p-8 md:p-10">
              <h3 className="text-lg font-medium">Property highlights</h3>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-title-muted">Location</dt>
                  <dd className="mt-1 text-base">{development.location}</dd>
                </div>
                <div>
                  <dt className="text-title-muted">Category</dt>
                  <dd className="mt-1 text-base capitalize">{development.category}</dd>
                </div>
                <div>
                  <dt className="text-title-muted">Type</dt>
                  <dd className="mt-1 text-base">{development.propertyType}</dd>
                </div>
                <div>
                  <dt className="text-title-muted">Availability</dt>
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

      <PropertyUnitTypesSection units={units} />
      <PropertyFloorPlansSection units={units} />

      <section className="py-16 md:py-24">
        <Container className="section-x grid gap-16 lg:grid-cols-2">
          <FadeInWhenVisible>
            <Eyebrow>Amenities</Eyebrow>
            <h2 className="text-heading-3 mt-4">Spaces for everyday living</h2>
            {development.amenities.length > 0 ? (
              <ul className="editorial-list mt-8 space-y-4 text-title-muted">
                {development.amenities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-title-muted">
                Amenity details will be published when verified for this
                development.
              </p>
            )}
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <Eyebrow>Sustainability</Eyebrow>
            <h2 className="text-heading-3 mt-4">Verified commitments</h2>
            {development.sustainability.length > 0 ? (
              <ul className="editorial-list mt-8 space-y-4 text-title-muted">
                {development.sustainability.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-title-muted">
                Sustainability information pending authorized materials.
              </p>
            )}
          </FadeInWhenVisible>
        </Container>
      </section>

      <PropertyVideoSection development={development} />

      <section className="bg-ink py-16 text-surface md:py-20">
        <Container className="section-x grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Eyebrow dark>Location</Eyebrow>
            <h2 className="text-heading-3 mt-4">{development.location}</h2>
            <p className="mt-4 max-w-xl text-surface/75">
              Refer to the official ARTHALAND development page for maps and
              neighborhood context, or speak with our sales team.
            </p>
          </div>
          <div className="flex items-end">
            <Button href={development.officialUrl} variant="outlineOnDark" size="compact">
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
        title={`Request a viewing — ${development.name}`}
        body="Share your questions or schedule a consultation. Our sales team responds with verified information from ARTHALAND."
      />
    </>
  )
}
