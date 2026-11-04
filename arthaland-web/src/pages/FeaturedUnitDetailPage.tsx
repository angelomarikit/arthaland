import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { FeaturedUnitPhotoGallery } from '../components/featuredUnit/FeaturedUnitPhotoGallery'
import type { FeaturedUnit } from '../domain/featuredUnit/types'
import { fetchFeaturedUnitBySlug } from '../lib/cms/featuredUnitsApi'
import { getFeaturedUnitPhotos } from '../lib/featuredUnitPhotos'

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

  const photos = getFeaturedUnitPhotos(unit)
  const statusLabel =
    unit.status === 'reserved' ? 'Reserved' : unit.status === 'sold' ? 'Sold' : 'Available'

  return (
    <>
      <SiteHeader />
      <div className="border-b border-border bg-surface pt-[var(--site-header-h)]">
        <Container className="section-x py-4 md:py-6">
          <Link to="/featured-units" className="text-nav-primary text-sm text-title-muted hover:text-ink">
            ← Featured units
          </Link>
        </Container>
        <Container className="section-x pb-6 md:pb-8">
          <FeaturedUnitPhotoGallery photos={photos} title={unit.title} />
        </Container>
      </div>

      <Container className="section-x py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              {unit.isSampleGuide ? (
                <span className="text-[10px] border border-amber-300 bg-amber-50 px-2 py-1 font-medium uppercase tracking-wider text-amber-950">
                  Sample listing — format guide
                </span>
              ) : null}
              <span className="text-button border border-border px-3 py-1">{statusLabel}</span>
            </div>
            <h1 className="text-display-m mt-4">{unit.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-title-muted">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {unit.location}
            </p>
            <p className="mt-1 text-sm text-title-muted">{unit.developmentName}</p>

            <div className="mt-8 flex flex-wrap gap-6 border-y border-border py-6 text-sm">
              {unit.unitLabel ? (
                <div>
                  <p className="text-title-muted">Unit</p>
                  <p className="mt-1 text-lg font-medium">{unit.unitLabel}</p>
                </div>
              ) : null}
              {unit.areaSqm ? (
                <div>
                  <p className="text-title-muted">Area</p>
                  <p className="mt-1 text-lg font-medium">{unit.areaSqm} sqm</p>
                </div>
              ) : null}
              {unit.bedrooms ? (
                <div>
                  <p className="text-title-muted">Bedrooms</p>
                  <p className="mt-1 text-lg font-medium">{unit.bedrooms}</p>
                </div>
              ) : null}
              {unit.bathrooms ? (
                <div>
                  <p className="text-title-muted">Bathrooms</p>
                  <p className="mt-1 text-lg font-medium">{unit.bathrooms}</p>
                </div>
              ) : null}
              {unit.floor ? (
                <div>
                  <p className="text-title-muted">Floor</p>
                  <p className="mt-1 text-lg font-medium">{unit.floor}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-8">
              <h2 className="text-heading-3">About this unit</h2>
              <p className="mt-4 leading-relaxed text-title-muted">{unit.description}</p>
              {unit.highlights.length > 0 ? (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {unit.highlights.map((h) => (
                    <li
                      key={h}
                      className="border border-border bg-surface-soft px-4 py-3 text-sm text-ink"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-[calc(var(--site-header-h)+1.5rem)] border border-border bg-surface p-6 shadow-sm md:p-8">
              <p className="text-sm text-title-muted">Listed price</p>
              <p className="mt-2 text-3xl font-medium tracking-[-0.03em]">{unit.priceLabel}</p>
              <p className="mt-4 text-sm leading-relaxed text-title-muted">
                Confirm availability, payment terms, and viewing schedules with the ARTHALAND sales
                team.
              </p>
              <Button
                href={`/contact?unit=${encodeURIComponent(unit.slug)}`}
                className="mt-8 w-full justify-center"
              >
                Inquire about this unit
              </Button>
              <Button
                href="/featured-units"
                variant="outline"
                className="mt-3 w-full justify-center"
              >
                Browse more units
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
