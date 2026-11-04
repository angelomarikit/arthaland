import type { UnitType } from '../../domain/development/types'
import { Eyebrow } from '../ui/Eyebrow'

type PropertyUnitTypesSectionProps = {
  units: UnitType[]
}

export function PropertyUnitTypesSection({ units }: PropertyUnitTypesSectionProps) {
  if (units.length === 0) return null

  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="section-x mx-auto max-w-[1200px] px-6">
        <Eyebrow>Residences</Eyebrow>
        <h2 className="text-heading-3 mt-4">Unit types</h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <li
              key={unit.id}
              className="border border-border bg-surface-soft p-6 md:p-8"
            >
              <h3 className="text-xl font-medium tracking-[-0.03em]">{unit.name}</h3>
              {unit.bedrooms && (
                <p className="mt-2 text-sm text-title-muted">{unit.bedrooms} bedroom</p>
              )}
              {(unit.areaMin || unit.areaMax) && (
                <p className="mt-2 text-sm">
                  {unit.areaMin && unit.areaMax && unit.areaMin !== unit.areaMax
                    ? `${unit.areaMin}–${unit.areaMax} sqm`
                    : `${unit.areaMin ?? unit.areaMax} sqm`}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
