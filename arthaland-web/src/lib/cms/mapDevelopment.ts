import type { Development, DevelopmentCategory, PropertyType } from '../../domain/development/types'
import type { DbCmsMedia, DbDevelopment } from '../supabase/database.types'
import { mediaPublicUrl } from './mediaUpload'

function asCategory(v: string | null): DevelopmentCategory {
  if (v === 'commercial' || v === 'mixed-use') return v
  return 'residential'
}

function asPropertyType(v: string | null): PropertyType {
  const allowed: PropertyType[] = [
    'Residential Condominium',
    'Mixed-Use',
    'Villa',
    'Apartment',
    'Commercial Office',
    'Commercial Retail',
  ]
  if (v && allowed.includes(v as PropertyType)) return v as PropertyType
  return 'Residential Condominium'
}

function publicationStatus(row: DbDevelopment): Development['publicationStatus'] {
  if (row.publication_status) return row.publication_status
  return row.published ? 'published' : 'draft'
}

export function mapDbDevelopment(
  row: DbDevelopment,
  galleryMedia: DbCmsMedia[] = [],
): Development {
  const galleryFromMedia = galleryMedia
    .filter((m) => m.media_kind === 'image' && m.published)
    .sort((a, b) => a.display_order - b.display_order)
    .map((m) => mediaPublicUrl(m))

  const legacyGallery = Array.isArray(row.gallery) ? row.gallery : []
  const gallery = galleryFromMedia.length ? galleryFromMedia : legacyGallery

  const hero = row.hero_image ?? row.cover_image ?? gallery[0] ?? ''
  const shortDescription = row.short_description ?? row.summary ?? ''
  const fullDescription = row.full_description ?? row.overview ?? ''

  const pub = publicationStatus(row)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: asCategory(row.category),
    propertyType: asPropertyType(row.property_type ?? row.type),
    location: row.location,
    region: row.region,
    shortDescription,
    fullDescription,
    coverImage: row.cover_image ?? hero,
    heroImage: hero,
    cardImage: row.card_image ?? hero,
    publicationStatus: pub,
    availabilityStatus:
      (row.availability_status ?? row.status ?? 'Inquire for Availability') as Development['availabilityStatus'],
    priceLabel: row.price_label,
    featured: Boolean(row.featured),
    displayOrder: row.display_order ?? 0,
    bedroomsRange: row.bedrooms_range ?? undefined,
    areaRange: row.area_range ?? undefined,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    sustainability: Array.isArray(row.sustainability) ? row.sustainability : [],
    officialUrl: row.official_url ?? '',
    sourceNote: row.source_note ?? undefined,
    usesIllustrativeImagery: Boolean(row.uses_illustrative_imagery),
    videoUrl: row.video_url ?? undefined,
    videoPoster: row.video_poster ?? undefined,
    seo: (row.seo as Development['seo']) ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
    summary: shortDescription,
    overview: fullDescription,
    published: pub === 'published',
    status:
      (row.availability_status ?? row.status ?? 'Inquire for Availability') as Development['availabilityStatus'],
    type: asPropertyType(row.property_type ?? row.type),
    gallery,
  }
}
