import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sectionImages } from '../../config/sectionImages'
import { usePageSection } from '../../contexts/PageContentContext'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const serviceCopy = [
  {
    title: 'Property Consultation',
    body: 'Development overview, unit-type guidance, and verified pricing where published on arthaland.com.',
  },
  {
    title: 'Development Information',
    body: 'Sustainability credentials, amenities, and construction status sourced from official pages.',
  },
  {
    title: 'Viewing Coordination',
    body: 'Schedule show suites and site visits with the sales team supervised by Mr. Gary Lee.',
  },
  {
    title: 'Buying Process Guidance',
    body: 'Reservation steps, timelines, and escalation to corporate teams when needed.',
  },
] as const

const services = serviceCopy.map((s, i) => ({
  ...s,
  image: sectionImages.services[i]!,
}))

/** Static services block — no scroll pin/scrub (was causing jank with Lenis). */
export function ServicesPinnedSection() {
  const copy = usePageSection('services-preview')
  const [active, setActive] = useState(0)
  const current = services[active]!

  return (
    <section className="bg-ink text-surface">
      <Container className="section-x pt-20 md:pt-28">
        <Eyebrow dark>{copy.eyebrow ?? 'Services'}</Eyebrow>
        <h2 className="text-heading-2 mt-4 max-w-[18ch]">
          {copy.title ?? 'Sales-team guidance at every step'}
        </h2>
        <p className="mt-4 max-w-xl text-sm text-[#bababa] whitespace-pre-line">
          {copy.body ??
            'Service categories are proposed for this channel — confirm scope with the client before publishing as commitments.'}
        </p>
      </Container>

      <div className="section-x pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft max-lg:order-2">
            {services.map((s, i) => (
              <img
                key={s.title}
                src={s.image}
                alt=""
                className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          <div className="flex flex-col justify-center max-lg:order-1">
            <div className="mb-8 hidden gap-2 lg:flex" role="tablist" aria-label="Services">
              {services.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`h-0.5 flex-1 transition-colors ${i <= active ? 'bg-accent' : 'bg-border-on-dark'} ${i === active ? 'ring-1 ring-accent/40' : ''}`}
                  title={s.title}
                />
              ))}
            </div>

            <div className="lg:min-h-[280px]" role="tabpanel">
              <p className="text-sm text-[#bababa]">
                {String(active + 1).padStart(2, '0')}
              </p>
              <h3 className="text-heading-3 mt-2">{current.title}</h3>
              <p className="mt-4 max-w-md text-[#bababa]">{current.body}</p>
            </div>

            <Link
              to="/services"
              className="text-nav mt-10 inline-flex text-accent hover:underline"
            >
              View all services →
            </Link>
          </div>
        </div>

        <div className="mt-10 space-y-4 lg:hidden">
          {services.map((s) => (
            <details key={s.title} className="border border-border-on-dark p-4">
              <summary className="cursor-pointer text-lg font-medium">
                {s.title}
              </summary>
              <p className="mt-3 text-sm text-[#bababa]">{s.body}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
