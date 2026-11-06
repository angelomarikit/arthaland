import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { PropertyCard } from '../components/property/PropertyCard'
import { PropertyFilters } from '../components/property/PropertyFilters'
import { FeaturedDevelopmentSpotlight } from '../components/property/FeaturedDevelopmentSpotlight'
import { developmentAssets } from '../config/developmentAssets'
import type { AvailabilityStatus, DevelopmentCategory } from '../domain/development/types'
import {
  filterDevelopments,
  usePublicDevelopmentsList,
} from '../hooks/usePublicDevelopments'
import { useSupabaseCms } from '../lib/supabase/config'

export function PropertiesPage() {
  const cms = useSupabaseCms()
  const { items: all, state, error } = usePublicDevelopmentsList()
  const regions = [...new Set(all.map((d) => d.region))]
  const spotlight =
    all.find((d) => d.featured && d.publicationStatus === 'published') ??
    all.find((d) => d.publicationStatus === 'published')
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState<DevelopmentCategory | ''>('')
  const [status, setStatus] = useState<AvailabilityStatus | ''>('')
  const [sort, setSort] = useState<'featured' | 'name'>('featured')

  const filtered = useMemo(
    () =>
      filterDevelopments(all, {
        query,
        region,
        category,
        status,
        sort,
      }),
    [all, query, region, category, status, sort],
  )

  const showSpotlight =
    Boolean(spotlight) && filtered.some((d) => d.slug === spotlight!.slug)
  const gridItems =
    showSpotlight && spotlight
      ? filtered.filter((d) => d.slug !== spotlight.slug)
      : filtered

  return (
    <>
      <SiteHeader embedded />
      {state === 'loading' && (
        <div className="border-b border-border bg-surface-soft py-3 text-center text-sm text-title-muted">
          Loading portfolio…
        </div>
      )}
      {cms && state === 'error' && error && (
        <div className="border-b border-amber-200 bg-amber-50 py-2 text-center text-xs text-amber-950">
          Could not load developments from Supabase ({error}). Confirm env vars and RLS policies.
        </div>
      )}
      <section className="hero-under-header relative min-h-[58vh] overflow-hidden bg-ink text-surface md:min-h-[65vh]">
        <img
          src={developmentAssets.propertiesHero}
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
            Explore the ARTHALAND portfolio — residential landmarks, commercial
            addresses, and masterplanned communities across the Philippines.
          </p>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-16 md:py-20">
        <Container className="section-x">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <FadeInWhenVisible className="lg:col-span-5">
              <p className="text-eyebrow text-title-muted">Portfolio</p>
              <h2 className="text-heading-3 mt-4">
                Ten developments. One sustainable vision.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-title-muted">
                Published listings show verified details from authorized ARTHALAND materials.
                Coming-soon and draft projects appear only when appropriate for
                this sales channel.
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible className="lg:col-span-7">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={developmentAssets.propertiesIntro}
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
        <section id="featured" className="section-x py-16 md:py-20">
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
            category={category}
            onCategoryChange={setCategory}
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
                Try adjusting category, location, or status — or contact our
                sales team for guidance.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
              {gridItems.map((development, index) => (
                <FadeInWhenVisible key={development.slug}>
                  <PropertyCard
                    development={development}
                    imageAspect={index % 3 === 1 ? 'landscape' : 'portrait'}
                  />
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
