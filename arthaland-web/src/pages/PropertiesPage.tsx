import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyFilters } from '../components/property/PropertyFilters'
import { FeaturedDevelopmentSpotlight } from '../components/property/FeaturedDevelopmentSpotlight'
import { sectionImages } from '../config/sectionImages'
import {
  getPrimaryFeaturedDevelopment,
  getPublishedDevelopments,
  type DevelopmentStatus,
  type PropertyType,
} from '../data/developments'

const regions = [...new Set(getPublishedDevelopments().map((d) => d.region))]

export function PropertiesPage() {
  const all = getPublishedDevelopments()
  const spotlight = getPrimaryFeaturedDevelopment()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [region, setRegion] = useState('')
  const [type, setType] = useState<PropertyType | ''>('')
  const [status, setStatus] = useState<DevelopmentStatus | ''>('')
  const [sort, setSort] = useState<'featured' | 'name'>('featured')

  const filtered = useMemo(() => {
    let list = [...all]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q),
      )
    }
    if (region) list = list.filter((d) => d.region === region)
    if (type) list = list.filter((d) => d.type === type)
    if (status) list = list.filter((d) => d.status === status)
    if (sort === 'featured') {
      list.sort((a, b) => Number(b.featured) - Number(a.featured))
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [all, query, region, type, status, sort])

  const showSpotlight =
    Boolean(spotlight) && filtered.some((d) => d.slug === spotlight!.slug)
  const gridItems =
    showSpotlight && spotlight
      ? filtered.filter((d) => d.slug !== spotlight.slug)
      : filtered

  return (
    <>
      <SiteHeader embedded />
      <section className="relative min-h-[58vh] overflow-hidden bg-ink text-surface md:min-h-[65vh]">
        <img
          src={sectionImages.propertiesHero}
          alt=""
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <Container className="section-x relative flex min-h-[58vh] flex-col justify-end pb-14 pt-32 md:min-h-[65vh] md:pb-20 md:pt-40">
          <p className="text-eyebrow text-surface/70">Properties</p>
          <h1 className="text-display-l mt-5 max-w-[14ch] animate-fade-up">
            <span className="block">Discover a More</span>
            <span className="block">Considered Way of Living.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-surface/80 animate-fade-up animation-delay-150">
            Verified ARTHALAND residential developments — curated for discerning
            buyers seeking thoughtful design and sustainable places to live.
          </p>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-16 md:py-20">
        <Container className="section-x">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <FadeInWhenVisible className="lg:col-span-5">
              <p className="text-eyebrow text-title-muted">Portfolio</p>
              <h2 className="text-heading-3 mt-4">
                Residences shaped by architecture and sustainability
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-title-muted">
                Pricing and unit availability appear only when verified on
                arthaland.com. Our sales team can confirm current details for
                each development.
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible className="lg:col-span-7">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={sectionImages.propertiesIntro}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </Container>
      </section>

      {showSpotlight && spotlight && (
        <section className="section-x py-16 md:py-20">
          <Container>
            <FeaturedDevelopmentSpotlight development={spotlight} />
          </Container>
        </section>
      )}

      <section className="bg-surface-soft pb-24 pt-8 md:pb-32">
        <Container className="section-x">
          <PropertyFilters
            query={query}
            onQueryChange={setQuery}
            region={region}
            onRegionChange={setRegion}
            type={type}
            onTypeChange={setType}
            status={status}
            onStatusChange={setStatus}
            sort={sort}
            onSortChange={setSort}
            regions={regions}
          />

          <p className="mt-8 text-sm text-title-muted">
            {filtered.length} development{filtered.length === 1 ? '' : 's'}
          </p>

          {filtered.length === 0 ? (
            <div className="mt-16 border border-border bg-surface px-8 py-16 text-center">
              <h2 className="text-heading-3">No developments match your filters</h2>
              <p className="mx-auto mt-4 max-w-md text-title-muted">
                Try adjusting location, type, or status — or contact our sales team
                for guidance across the ARTHALAND portfolio.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
              {gridItems.map((development) => (
                <FadeInWhenVisible key={development.slug}>
                  <PropertyCard development={development} />
                </FadeInWhenVisible>
              ))}
            </div>
          )}
        </Container>
      </section>

      <PageConsultCta />
    </>
  )
}
