import { useMemo, useState } from 'react'
import type { UnitType } from '../../domain/development/types'
import { UNIT_TAB_LABEL, UNIT_TAB_ORDER } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

type PropertyUnitLayoutsSectionProps = {
  units: UnitType[]
}

export function PropertyUnitLayoutsSection({ units }: PropertyUnitLayoutsSectionProps) {
  const tabGroups = useMemo(() => {
    const present = new Set(
      units.map((u) => u.tabGroup ?? 'custom').filter(Boolean),
    )
    return UNIT_TAB_ORDER.filter((t) => present.has(t))
  }, [units])

  const [activeTab, setActiveTab] = useState(tabGroups[0] ?? 'custom')
  const [zoomUnitId, setZoomUnitId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      units.filter((u) => (u.tabGroup ?? 'custom') === activeTab).sort(
        (a, b) => a.displayOrder - b.displayOrder,
      ),
    [units, activeTab],
  )

  if (units.length === 0) {
    return (
      <section className="py-16 md:py-20" id="layouts">
        <Container className="section-x max-w-3xl">
          <Eyebrow>Residences</Eyebrow>
          <h2 className="text-heading-3 mt-4">Unit layouts</h2>
          <p className="mt-4 text-title-muted">
            Content will be published when available.
          </p>
        </Container>
      </section>
    )
  }

  const zoomUnit = zoomUnitId
    ? units.find((u) => u.id === zoomUnitId)
    : undefined

  return (
    <section className="py-16 md:py-24" id="layouts">
      <Container className="section-x">
        <FadeInWhenVisible>
          <Eyebrow>Residences</Eyebrow>
          <h2 className="text-heading-3 mt-4">Unit layouts & floor plans</h2>
          {tabGroups.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tabGroups.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    activeTab === tab
                      ? 'border-ink bg-ink text-surface'
                      : 'border-border text-title-muted'
                  }`}
                >
                  {UNIT_TAB_LABEL[tab]}
                </button>
              ))}
            </div>
          )}
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {filtered.map((unit) => (
              <article key={unit.id} className="border border-border bg-surface-soft p-6">
                <h3 className="text-lg font-medium">{unit.name}</h3>
                {unit.description && (
                  <p className="mt-2 text-sm text-title-muted">{unit.description}</p>
                )}
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {unit.bedrooms && (
                    <>
                      <dt className="text-title-muted">Bedrooms</dt>
                      <dd>{unit.bedrooms}</dd>
                    </>
                  )}
                  {unit.bathrooms && (
                    <>
                      <dt className="text-title-muted">Bathrooms</dt>
                      <dd>{unit.bathrooms}</dd>
                    </>
                  )}
                  {(unit.areaMin || unit.areaMax) && (
                    <>
                      <dt className="text-title-muted">Area (sqm)</dt>
                      <dd>
                        {[unit.areaMin, unit.areaMax].filter(Boolean).join(' – ')}
                      </dd>
                    </>
                  )}
                  {unit.priceNote && (
                    <>
                      <dt className="text-title-muted">Pricing note</dt>
                      <dd>{unit.priceNote}</dd>
                    </>
                  )}
                </dl>
                {unit.features && unit.features.length > 0 && (
                  <ul className="mt-4 list-disc pl-5 text-sm text-title-muted">
                    {unit.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                {unit.unitRenderImages && unit.unitRenderImages[0] && (
                  <img
                    src={unit.unitRenderImages[0]}
                    alt=""
                    className="mt-6 aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                )}
                {unit.floorPlanImages[0] && (
                  <button
                    type="button"
                    className="relative mt-6 block w-full overflow-hidden border border-border"
                    onClick={() => setZoomUnitId(unit.id)}
                  >
                    <img
                      src={unit.floorPlanImages[0]}
                      alt={`Floor plan — ${unit.name}`}
                      className="aspect-[4/3] w-full object-contain bg-surface transition-transform hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 text-xs text-surface">
                      Zoom
                    </span>
                  </button>
                )}
                {unit.brochureUrl && (
                  <a
                    href={unit.brochureUrl}
                    className="mt-4 inline-block text-sm underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download brochure
                  </a>
                )}
              </article>
            ))}
          </div>
        </FadeInWhenVisible>
      </Container>

      {zoomUnit?.floorPlanImages[0] && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setZoomUnitId(null)}
          aria-label="Close floor plan"
        >
          <img
            src={zoomUnit.floorPlanImages[0]}
            alt=""
            className="max-h-[90vh] max-w-full object-contain"
          />
        </button>
      )}
    </section>
  )
}
