import { useParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyAmenitiesSection } from '../components/property/PropertyAmenitiesSection'
import { PropertyCertificationsSection } from '../components/property/PropertyCertificationsSection'
import { PropertyDetailHero } from '../components/property/PropertyDetailHero'
import { PropertyGalleryCollectionsSection } from '../components/property/PropertyGalleryCollectionsSection'
import { PropertyInquirySection } from '../components/property/PropertyInquirySection'
import { PropertyLocationSection } from '../components/property/PropertyLocationSection'
import { PropertyNearbySection } from '../components/property/PropertyNearbySection'
import { PropertyOverviewSection } from '../components/property/PropertyOverviewSection'
import { PropertyUnitLayoutsSection } from '../components/property/PropertyUnitLayoutsSection'
import { PropertyVideoSection } from '../components/property/PropertyVideoSection'
import { isSoldOutDevelopment } from '../config/developments'
import { useSupabaseCms } from '../lib/supabase/config'
import {
  usePublicDevelopmentsList,
  usePublicPropertyPageData,
} from '../hooks/usePublicDevelopments'

export function PropertyDetailPage() {
  const { slug } = useParams()
  const cms = useSupabaseCms()
  const { page, development, units, state } = usePublicPropertyPageData(slug)
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

  if (!development || !page || (slug && isSoldOutDevelopment(slug))) {
    return (
      <>
        <SiteHeader />
        <Container className="section-x py-32">
          <h1 className="text-heading-2">Development not found</h1>
          <p className="mt-4 text-title-muted">
            This listing is sold out, unpublished, or unavailable on the sales channel.
          </p>
          <Button href="/properties" className="mt-8">
            Back to Properties
          </Button>
        </Container>
      </>
    )
  }

  const list = portfolioList
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
      {cms && state === 'error' && (
        <div className="border-b border-amber-200 bg-amber-50 py-2 text-center text-xs text-amber-950">
          Could not load this development from the CMS. Check your network connection and
          Supabase configuration.
        </div>
      )}
      <PropertyDetailHero development={development} specs={page.specs} />

      {development.publicationStatus === 'coming_soon' && (
        <div className="border-b border-border bg-surface-soft py-4">
          <Container className="section-x text-center text-sm text-title-muted">
            Full sales listing coming soon — contact the team for verified information in
            the meantime.
          </Container>
        </div>
      )}

      {development.publicationStatus === 'draft' && (
        <div className="border-b border-border bg-surface-soft py-4">
          <Container className="section-x text-center text-sm text-title-muted">
            This development profile is in preparation. Verified specifications and
            photography will be published when available — inquire for current information.
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

      <PropertyOverviewSection development={development} specs={page.specs} />
      <PropertyCertificationsSection items={page.certifications} />
      <PropertyLocationSection development={development} location={page.location} />
      <PropertyNearbySection items={page.nearby} />
      <PropertyAmenitiesSection
        development={development}
        amenitiesRich={page.amenitiesRich}
      />
      <PropertyGalleryCollectionsSection
        developmentName={development.name}
        collections={page.galleryCollections}
        legacyGallery={page.legacyGallery}
      />
      <PropertyUnitLayoutsSection units={units} />
      <PropertyVideoSection development={development} video={page.video} />
      <PropertyInquirySection development={development} units={units} />

      {relatedList.length > 0 && (
        <section className="border-t border-border py-16 md:py-24">
          <Container className="section-x">
            <h2 className="text-heading-3">Related developments</h2>
            <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {relatedList.map((d) => (
                <PropertyCard key={d.slug} development={d} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
