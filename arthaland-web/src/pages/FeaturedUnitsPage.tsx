import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FeaturedUnitCard } from '../components/featuredUnit/FeaturedUnitCard'
import { FeaturedUnitsSearch } from '../components/featuredUnit/FeaturedUnitsSearch'
import { Button } from '../components/ui/Button'
import { usePublicFeaturedUnits } from '../hooks/usePublicFeaturedUnits'
import {
  filterFeaturedUnits,
  uniqueDevelopmentNames,
} from '../lib/featuredUnitsSearch'
import { PageConsultCta } from '../components/page/PageConsultCta'

export function FeaturedUnitsPage() {
  const { items, loading } = usePublicFeaturedUnits()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [development, setDevelopment] = useState(() => searchParams.get('dev') ?? '')

  const developments = useMemo(() => uniqueDevelopmentNames(items), [items])

  const filtered = useMemo(
    () => filterFeaturedUnits(items, query, development),
    [items, query, development],
  )

  function updateQuery(value: string) {
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value.trim())
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  function updateDevelopment(value: string) {
    setDevelopment(value)
    const next = new URLSearchParams(searchParams)
    if (value) next.set('dev', value)
    else next.delete('dev')
    setSearchParams(next, { replace: true })
  }

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
            <>
              <FeaturedUnitsSearch
                query={query}
                onQueryChange={updateQuery}
                development={development}
                onDevelopmentChange={updateDevelopment}
                developments={developments}
                resultCount={filtered.length}
                totalCount={items.length}
              />
              {filtered.length === 0 ? (
                <div className="border border-dashed border-border bg-surface-soft p-8 text-center">
                  <p className="text-lg font-medium">No listings match your search</p>
                  <p className="mt-2 text-sm text-title-muted">
                    Try a different keyword or clear the development filter.
                  </p>
                  <button
                    type="button"
                    className="text-nav-primary mt-6 underline underline-offset-4"
                    onClick={() => {
                      updateQuery('')
                      updateDevelopment('')
                    }}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((unit) => (
                    <li key={unit.id} className="flex">
                      <FeaturedUnitCard unit={unit} />
                    </li>
                  ))}
                </ul>
              )}
            </>
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
