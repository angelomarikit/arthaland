import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import type { FeaturedUnit } from '../domain/featuredUnit/types'
import { fetchFeaturedUnitBySlug } from '../lib/cms/featuredUnitsApi'

export function FeaturedUnitDetailPage() {
  const { slug = '' } = useParams()
  const [unit, setUnit] = useState<FeaturedUnit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchFeaturedUnitBySlug(slug)
      .then(setUnit)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <>
        <SiteHeader />
        <Container className="section-x py-32 text-sm text-title-muted">Loading…</Container>
      </>
    )
  }

  if (!unit) {
    return (
      <>
        <SiteHeader />
        <Container className="section-x py-32">
          <p className="text-lg font-medium">Listing not found</p>
          <Link to="/featured-units" className="mt-4 inline-block underline">
            Back to featured units
          </Link>
        </Container>
      </>
    )
  }

  const gallery = unit.gallery.length ? unit.gallery : unit.heroImage ? [unit.heroImage] : []

  return (
    <>
      <SiteHeader embedded />
      <section className="hero-under-header bg-surface pb-16 pt-28 md:pb-24 md:pt-32">
        <Container className="section-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
              {unit.heroImage ? (
                <img src={unit.heroImage} alt="" className="size-full object-cover" />
              ) : null}
            </div>
            {gallery.length > 1 ? (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {gallery.slice(0, 6).map((src) => (
                  <li key={src} className="aspect-[4/3] overflow-hidden bg-surface-muted">
                    <img src={src} alt="" className="size-full object-cover" loading="lazy" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="lg:col-span-5">
            <Eyebrow>{unit.developmentName}</Eyebrow>
            <h1 className="text-display-m mt-4">{unit.title}</h1>
            <p className="mt-2 text-title-muted">{unit.location}</p>
            <p className="mt-6 text-2xl font-medium tracking-[-0.03em]">{unit.priceLabel}</p>
            <ul className="mt-8 grid gap-3 border-y border-border py-6 text-sm sm:grid-cols-2">
              {unit.unitLabel ? (
                <li>
                  <span className="text-title-muted">Unit type</span>
                  <p className="font-medium">{unit.unitLabel}</p>
                </li>
              ) : null}
              {unit.areaSqm ? (
                <li>
                  <span className="text-title-muted">Area</span>
                  <p className="font-medium">{unit.areaSqm} sqm</p>
                </li>
              ) : null}
              {unit.bedrooms ? (
                <li>
                  <span className="text-title-muted">Bedrooms</span>
                  <p className="font-medium">{unit.bedrooms}</p>
                </li>
              ) : null}
              {unit.bathrooms ? (
                <li>
                  <span className="text-title-muted">Bathrooms</span>
                  <p className="font-medium">{unit.bathrooms}</p>
                </li>
              ) : null}
              {unit.floor ? (
                <li>
                  <span className="text-title-muted">Floor</span>
                  <p className="font-medium">{unit.floor}</p>
                </li>
              ) : null}
            </ul>
            <p className="mt-6 leading-relaxed text-title-muted">{unit.description}</p>
            {unit.highlights.length > 0 ? (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-title-muted">
                {unit.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
            <Button href={`/contact?unit=${encodeURIComponent(unit.slug)}`} className="mt-10">
              Inquire about this unit
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
