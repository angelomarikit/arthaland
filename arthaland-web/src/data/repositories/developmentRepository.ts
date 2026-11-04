import type {
  Development,
  DevelopmentCategory,
  DevelopmentMedia,
  DevelopmentRecord,
  UnitType,
} from '../../domain/development/types'
import {
  developmentMediaSeed,
  developmentSeed,
  unitTypesSeed,
} from '../seed/developments.seed'

function toView(record: DevelopmentRecord): Development {
  const gallery = getDevelopmentMedia(record.id)
    .filter((m) => m.mediaType === 'image' || m.mediaType === 'hero')
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((m) => m.publicUrl)

  const uniqueGallery = [...new Set(gallery.length ? gallery : [record.heroImage])]

  return {
    ...record,
    summary: record.shortDescription,
    overview: record.fullDescription,
    published: record.publicationStatus === 'published',
    status: record.availabilityStatus,
    type: record.propertyType,
    gallery: uniqueGallery,
  }
}

export function getDevelopments(): Development[] {
  return [...developmentSeed]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(toView)
}

/** Public portfolio: published + coming soon (not draft). */
export function getPortfolioDevelopments(): Development[] {
  return getDevelopments().filter(
    (d) =>
      d.publicationStatus === 'published' || d.publicationStatus === 'coming_soon',
  )
}

/** Main navigation — all 10 default developments, grouped by category. */
export function getNavigationDevelopments(): Development[] {
  return getDevelopments()
}

export function getPublishedDevelopments(): Development[] {
  return getDevelopments().filter((d) => d.publicationStatus === 'published')
}

/** Inquiry / contact forms — full portfolio list (matches main nav). */
export function getInquiryFormDevelopments(): Development[] {
  return getDevelopments()
}

export function getFeaturedDevelopments(): Development[] {
  return getPublishedDevelopments().filter((d) => d.featured)
}

export function getPrimaryFeaturedDevelopment(): Development | undefined {
  const featured = getFeaturedDevelopments()
  return featured[0] ?? getPublishedDevelopments()[0]
}

export function getDevelopmentBySlug(slug: string): Development | undefined {
  const record = developmentSeed.find((d) => d.slug === slug)
  if (!record) return undefined
  return toView(record)
}

export function getDevelopmentRecordBySlug(
  slug: string,
): DevelopmentRecord | undefined {
  return developmentSeed.find((d) => d.slug === slug)
}

/** Admin / CMS preview — all 10 defaults. */
export function getAllDevelopmentRecords(): DevelopmentRecord[] {
  return [...developmentSeed].sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getDevelopmentMedia(developmentId: string): DevelopmentMedia[] {
  return developmentMediaSeed
    .filter((m) => m.developmentId === developmentId)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

export function getUnitTypesByDevelopment(developmentId: string): UnitType[] {
  return unitTypesSeed
    .filter(
      (u) =>
        u.developmentId === developmentId &&
        u.publicationStatus !== 'draft',
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

export function filterDevelopments(
  list: Development[],
  opts: {
    query?: string
    region?: string
    category?: DevelopmentCategory | ''
    status?: Development['status'] | ''
    sort?: 'featured' | 'name'
  },
): Development[] {
  let result = [...list]
  const q = opts.query?.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q),
    )
  }
  if (opts.region) result = result.filter((d) => d.region === opts.region)
  if (opts.category)
    result = result.filter((d) => d.category === opts.category)
  if (opts.status) result = result.filter((d) => d.status === opts.status)
  if (opts.sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    result.sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        a.displayOrder - b.displayOrder,
    )
  }
  return result
}
