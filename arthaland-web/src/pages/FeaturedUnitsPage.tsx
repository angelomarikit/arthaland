import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FeaturedUnitCard } from '../components/featuredUnit/FeaturedUnitCard'
import { Button } from '../components/ui/Button'
import { usePublicFeaturedUnits } from '../hooks/usePublicFeaturedUnits'
import { PageConsultCta } from '../components/page/PageConsultCta'

export function FeaturedUnitsPage() {
  const { items, loading } = usePublicFeaturedUnits()

  return (
    <>
      <SiteHeader embedded />
      <section className="hero-under-header relative min-h-[42vh] overflow-hidden bg-ink text-surface md:min-h-[48vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        <Container className="section-x relative flex min-h-[42vh] flex-col justify-end pb-16 pt-32 md:min-h-[48vh] md:pb-20">
          <Eyebrow dark>Marketplace</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[16ch]">
            Featured units for sale
          </h1>
          <p className="mt-6 max-w-xl text-lg text-surface/80">
            Curated resale and developer inventory posted by the ARTHALAND sales team —
            photos, specs, and pricing guidance in one place.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x">
          {loading ? (
            <p className="text-sm text-title-muted">Loading listings…</p>
          ) : items.length === 0 ? (
            <div className="max-w-lg border border-dashed border-border bg-surface-soft p-8">
              <p className="text-lg font-medium">No featured units yet</p>
              <p className="mt-2 text-sm text-title-muted">
                New listings will appear here when published in the admin CMS.
              </p>
              <Button href="/contact" className="mt-6">
                Ask the sales team
              </Button>
            </div>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((unit) => (
                <li key={unit.id} className="flex">
                  <FeaturedUnitCard unit={unit} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <PageConsultCta
        eyebrow="Interested in a unit?"
        title="Request details or schedule a viewing"
        body="Tell us which featured listing caught your eye — we will confirm availability and next steps with the sales team."
      />
    </>
  )
}
