import type { UnitType } from '../../domain/development/types'
import { Eyebrow } from '../ui/Eyebrow'

type PropertyFloorPlansSectionProps = {
  units: UnitType[]
}

export function PropertyFloorPlansSection({
  units,
}: PropertyFloorPlansSectionProps) {
  const plans = units.flatMap((u) =>
    u.floorPlanImages.map((src) => ({ src, unitName: u.name })),
  )
  if (plans.length === 0) return null

  return (
    <section className="bg-surface-soft py-16 md:py-24">
      <div className="section-x mx-auto max-w-[1200px] px-6">
        <Eyebrow>Floor plans</Eyebrow>
        <h2 className="text-heading-3 mt-4">Verified layouts</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <figure key={plan.src} className="border border-border bg-surface p-4">
              <img
                src={plan.src}
                alt={`${plan.unitName} floor plan`}
                className="w-full object-contain"
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm text-title-muted">
                {plan.unitName}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
