import type { FeaturedUnit } from '../domain/featuredUnit/types'

/** All photos for a listing (hero + gallery, de-duplicated, order preserved). */
export function getFeaturedUnitPhotos(unit: FeaturedUnit): string[] {
  const ordered = [unit.heroImage, ...(unit.gallery ?? [])].filter(Boolean)
  return [...new Set(ordered)]
}
