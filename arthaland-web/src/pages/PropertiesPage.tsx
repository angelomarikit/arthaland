import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from '../animation/gsapSetup'
import { useGsapScope } from '../animation/useGsapScope'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { PropertyCard } from '../components/property/PropertyCard'
import {
  getPublishedDevelopments,
  type DevelopmentStatus,
  type PropertyType,
} from '../data/developments'

const regions = [...new Set(getPublishedDevelopments().map((d) => d.region))]

export function PropertiesPage() {
  const pageRef = useRef<HTMLElement>(null)
  const all = getPublishedDevelopments()
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

  useGsapScope(
    pageRef,
    () => {
      gsap.from('[data-property-card]', {
        y: 36,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-property-grid]',
          start: 'top 88%',
        },
      })
    },
    [filtered.map((d) => d.slug).join(',')],
  )

  return (
    <>
      <SiteHeader />
      <section ref={pageRef} className="bg-surface pb-20 pt-24 md:pb-40 md:pt-36">
        <Container className="section-x">
          <p className="text-eyebrow text-title-muted">Properties</p>
          <h1 className="text-heading-2 mt-4 max-w-[20ch]">
            Verified ARTHALAND developments
          </h1>
          <p className="mt-4 max-w-2xl text-title-muted">
            Curated listings from the official ARTHALAND portfolio. Pricing and unit
            availability are shown only when verified on arthaland.com.
          </p>

          <div className="mt-10 grid gap-4 border border-border bg-surface-soft p-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-3 lg:p-6">
            <input
              type="search"
              placeholder="Search developments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[48px] border border-border bg-surface px-3 lg:col-span-2"
              aria-label="Search"
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="min-h-[48px] border border-border bg-surface px-3"
              aria-label="Location"
            >
              <option value="">All locations</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType | '')}
              className="min-h-[48px] border border-border bg-surface px-3"
              aria-label="Property type"
            >
              <option value="">All types</option>
              <option value="Residential Condominium">Condominium</option>
              <option value="Apartment">Apartment</option>
              <option value="Mixed-Use">Mixed-Use</option>
              <option value="Villa">Villa</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DevelopmentStatus | '')}
              className="min-h-[48px] border border-border bg-surface px-3"
              aria-label="Availability"
            >
              <option value="">All status</option>
              <option value="Pre-Selling">Pre-Selling</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Completed">Completed</option>
              <option value="Inquire for Availability">Inquire for Availability</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'featured' | 'name')}
              className="min-h-[48px] border border-border bg-surface px-3 md:col-span-2 lg:col-span-1"
              aria-label="Sort"
            >
              <option value="featured">Featured first</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <p className="mt-6 text-sm text-title-muted">
            {filtered.length} development{filtered.length === 1 ? '' : 's'}
          </p>

          <div
            data-property-grid
            className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((development) => (
              <div key={development.slug} data-property-card>
                <PropertyCard development={development} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
