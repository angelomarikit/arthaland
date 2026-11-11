import type { Development } from '../../domain/development/types'
import type { PropertySpecs } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

type PropertyOverviewSectionProps = {
  development: Development
  specs: PropertySpecs
}

export function PropertyOverviewSection({
  development,
  specs,
}: PropertyOverviewSectionProps) {
  return (
    <section className="py-16 md:py-24" id="overview">
      <Container className="section-x grid gap-12 lg:grid-cols-12">
        <FadeInWhenVisible className="lg:col-span-7">
          <Eyebrow>Overview</Eyebrow>
          <h2 className="text-heading-3 mt-4">
            A considered address in {development.region}
          </h2>
          <p className="mt-6 leading-relaxed text-title-muted">
            {development.fullDescription}
          </p>
          {specs.overviewImageUrl && (
            <img
              src={specs.overviewImageUrl}
              alt=""
              className="mt-10 aspect-[16/10] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
          {development.sourceNote && (
            <p className="mt-6 border-l-2 border-border pl-4 text-sm text-title-muted">
              {development.sourceNote}
            </p>
          )}
        </FadeInWhenVisible>
        <FadeInWhenVisible className="lg:col-span-5">
          <div className="border border-border bg-surface-soft p-8 md:p-10">
            <h3 className="text-lg font-medium">Specifications</h3>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-title-muted">Location</dt>
                <dd className="mt-1 text-base">{development.location}</dd>
              </div>
              {specs.developerName && (
                <div>
                  <dt className="text-title-muted">Developer</dt>
                  <dd className="mt-1 text-base">{specs.developerName}</dd>
                </div>
              )}
              {specs.totalStories && (
                <div>
                  <dt className="text-title-muted">Stories</dt>
                  <dd className="mt-1 text-base">{specs.totalStories}</dd>
                </div>
              )}
              {specs.totalUnits && (
                <div>
                  <dt className="text-title-muted">Units</dt>
                  <dd className="mt-1 text-base">{specs.totalUnits}</dd>
                </div>
              )}
              {specs.completionDate && (
                <div>
                  <dt className="text-title-muted">Completion</dt>
                  <dd className="mt-1 text-base">{specs.completionDate}</dd>
                </div>
              )}
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
              {development.turnoverSchedule &&
                development.turnoverSchedule.milestones.length > 0 && (
                  <div>
                    <dt className="text-title-muted">Turnover</dt>
                    <dd className="mt-2 space-y-2 text-base">
                      {development.turnoverSchedule.milestones.map((item) => (
                        <div
                          key={`${item.label}-${item.date}`}
                          className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-border pb-2 last:border-0 last:pb-0"
                        >
                          <span>{item.label}</span>
                          <span className="text-title-muted">{item.date}</span>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
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
  )
}
