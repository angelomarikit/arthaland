import type { FeaturedUnit } from '../domain/featuredUnit/types'

export function filterFeaturedUnits(
  items: FeaturedUnit[],
  query: string,
  development: string,
): FeaturedUnit[] {
  const q = query.trim().toLowerCase()
  return items.filter((unit) => {
    if (development && unit.developmentName !== development) return false
    if (!q) return true
    const haystack = [
      unit.title,
      unit.developmentName,
      unit.location,
      unit.unitLabel,
      unit.priceLabel,
      unit.bedrooms,
      unit.bathrooms,
      unit.floor,
      unit.status,
      unit.areaSqm != null ? `${unit.areaSqm} sqm` : '',
      ...unit.highlights,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function uniqueDevelopmentNames(items: FeaturedUnit[]): string[] {
  return [...new Set(items.map((u) => u.developmentName).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  )
}
