import type { Amenity, Development, UnitType } from '../../domain/development/types'
import type {
  GalleryCollection,
  PropertyPageData,
  PropertySpecs,
} from '../../domain/propertyDetail/types'
import { applyPropertyTurnoverSchedule } from '../../config/propertyTurnoverSchedule'
import {
  getDevelopmentBySlug as getLocalBySlug,
  getUnitTypesByDevelopment,
} from '../../data/repositories/developmentRepository'
import { getSupabaseClient } from '../supabase/client'
import type {
  DbAmenity,
  DbCmsMedia,
  DbDevelopment,
  DbDevelopmentAmenity,
  DbDevelopmentCertification,
  DbDevelopmentNearbyPlace,
  DbGalleryCollection,
  DbUnitType,
} from '../supabase/database.types'
import { mapDbDevelopment, mapDbUnitType } from './mapDevelopment'
import { mediaPublicUrl } from './mediaUpload'

function isMissingRelationError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const msg = 'message' in err ? String((err as { message: string }).message) : ''
  return (
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    msg.includes('column') ||
    msg.includes('42P01')
  )
}

function mapSpecs(row: DbDevelopment, overviewUrl?: string): PropertySpecs {
  return {
    heroSubtitle: row.hero_subtitle ?? undefined,
    totalStories: row.total_stories ?? undefined,
    totalUnits: row.total_units ?? undefined,
    completionDate: row.completion_date ?? undefined,
    developerName: row.developer_name ?? undefined,
    overviewImageUrl: overviewUrl,
  }
}

function mapUnits(
  unitRows: DbUnitType[],
  mediaList: DbCmsMedia[],
): UnitType[] {
  const floorByUnit = new Map<string, DbCmsMedia[]>()
  const renderByUnit = new Map<string, DbCmsMedia[]>()
  for (const m of mediaList) {
    if (!m.unit_type_id) continue
    if (m.placement === 'floor_plan') {
      const list = floorByUnit.get(m.unit_type_id) ?? []
      list.push(m)
      floorByUnit.set(m.unit_type_id, list)
    } else if (m.placement === 'unit_render') {
      const list = renderByUnit.get(m.unit_type_id) ?? []
      list.push(m)
      renderByUnit.set(m.unit_type_id, list)
    }
  }

  return unitRows.map((row) => {
    const floors = (floorByUnit.get(row.id) ?? []).sort(
      (a, b) => a.display_order - b.display_order,
    )
    const renders = (renderByUnit.get(row.id) ?? []).sort(
      (a, b) => a.display_order - b.display_order,
    )
    return mapDbUnitType(
      row,
      floors.map((m) => mediaPublicUrl(m)),
      {
        unitRenderImages: renders.map((m) => mediaPublicUrl(m)),
      },
    )
  })
}

function groupGallery(
  collections: DbGalleryCollection[],
  mediaList: DbCmsMedia[],
): { collections: GalleryCollection[]; legacyGallery: string[] } {
  const galleryMedia = mediaList.filter(
    (m) =>
      m.media_kind === 'image' &&
      m.published &&
      m.placement !== 'floor_plan' &&
      m.placement !== 'unit_render',
  )

  const byCollection = new Map<string, DbCmsMedia[]>()
  const unassigned: DbCmsMedia[] = []

  for (const m of galleryMedia) {
    if (m.gallery_collection_id) {
      const list = byCollection.get(m.gallery_collection_id) ?? []
      list.push(m)
      byCollection.set(m.gallery_collection_id, list)
    } else {
      unassigned.push(m)
    }
  }

  const mappedCollections: GalleryCollection[] = collections
    .filter((c) => c.published)
    .sort((a, b) => a.display_order - b.display_order)
    .map((c) => {
      const imgs = (byCollection.get(c.id) ?? [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((m) => ({
          id: m.id,
          url: mediaPublicUrl(m),
          alt: m.alt_text ?? '',
          caption: m.caption ?? undefined,
        }))
      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description ?? undefined,
        displayOrder: c.display_order,
        images: imgs,
      }
    })
    .filter((c) => c.images.length > 0)

  const legacyFromUnassigned = unassigned
    .sort((a, b) => a.display_order - b.display_order)
    .map((m) => mediaPublicUrl(m))

  return { collections: mappedCollections, legacyGallery: legacyFromUnassigned }
}

function mapAmenities(
  joinRows: DbDevelopmentAmenity[],
  amenityRows: DbAmenity[],
  mediaById: Map<string, DbCmsMedia>,
): Amenity[] {
  const amenityById = new Map(amenityRows.map((a) => [a.id, a]))
  return joinRows
    .sort((a, b) => a.display_order - b.display_order)
    .map((j) => {
      const base = amenityById.get(j.amenity_id)
      if (!base) return null
      const media = base.media_id ? mediaById.get(base.media_id) : undefined
      return {
        id: base.id,
        name: base.name,
        description: j.description ?? base.description ?? undefined,
        imageUrl: media ? mediaPublicUrl(media) : undefined,
      } as Amenity
    })
    .filter((a): a is Amenity => a !== null)
}

export function buildLocalPropertyPageData(slug: string): PropertyPageData | null {
  const dev = getLocalBySlug(slug)
  if (!dev) return null
  const units = getUnitTypesByDevelopment(dev.id)
  return {
    development: dev,
    specs: {},
    units,
    certifications: [],
    nearby: [],
    galleryCollections: [],
    legacyGallery: dev.gallery,
    amenitiesRich: dev.amenities.map((name, i) => ({
      id: `local-${i}`,
      name,
    })),
    location: {},
    video: {
      url: dev.videoUrl,
      poster: dev.videoPoster,
      source: 'upload',
    },
  }
}

export async function fetchPublicPropertyPageData(
  slug: string,
): Promise<PropertyPageData | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return buildLocalPropertyPageData(slug)

  const { data, error } = await supabase
    .from('developments')
    .select('*')
    .eq('slug', slug)
    .in('publication_status', ['published', 'coming_soon'])
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const row = data as DbDevelopment
  const developmentSlug = row.slug

  const safeSelect = async <T>(
    run: () => Promise<{ data: T | T[] | null; error: unknown }>,
    fallback: T[],
  ): Promise<T[]> => {
    try {
      const { data: rows, error: qErr } = await run()
      if (qErr) {
        if (isMissingRelationError(qErr)) return fallback
        throw qErr
      }
      return (rows ?? []) as T[]
    } catch (e) {
      if (isMissingRelationError(e)) return fallback
      throw e
    }
  }

  const [mediaList, unitRows, collections, certifications, nearby, joinAmenities] =
    await Promise.all([
      safeSelect(
        async () =>
          supabase
            .from('cms_media')
            .select('*')
            .eq('development_slug', developmentSlug)
            .eq('published', true)
            .order('display_order'),
        [] as DbCmsMedia[],
      ),
      safeSelect(
        async () =>
          supabase
            .from('cms_unit_types')
            .select('*')
            .eq('development_slug', developmentSlug)
            .in('publication_status', ['published', 'coming_soon'])
            .order('display_order'),
        [] as DbUnitType[],
      ),
      safeSelect(
        async () =>
          supabase
            .from('cms_gallery_collections')
            .select('*')
            .eq('development_slug', developmentSlug)
            .order('display_order'),
        [] as DbGalleryCollection[],
      ),
      safeSelect(
        async () =>
          supabase
            .from('cms_development_certifications')
            .select('*')
            .eq('development_slug', developmentSlug)
            .eq('published', true)
            .order('display_order'),
        [] as DbDevelopmentCertification[],
      ),
      safeSelect(
        async () =>
          supabase
            .from('cms_development_nearby_places')
            .select('*')
            .eq('development_slug', developmentSlug)
            .eq('published', true)
            .order('display_order'),
        [] as DbDevelopmentNearbyPlace[],
      ),
      safeSelect(
        async () =>
          supabase
            .from('cms_development_amenities')
            .select('*')
            .eq('development_id', row.id)
            .order('display_order'),
        [] as DbDevelopmentAmenity[],
      ),
    ])

  let amenityRows: DbAmenity[] = []
  if (joinAmenities.length > 0) {
    const ids = [...new Set(joinAmenities.map((j) => j.amenity_id))]
    const { data: aData, error: aErr } = await supabase
      .from('cms_amenities')
      .select('*')
      .in('id', ids)
    if (!aErr) amenityRows = (aData ?? []) as DbAmenity[]
  }

  const mediaById = new Map(mediaList.map((m) => [m.id, m]))
  const galleryForMap = mediaList.filter(
    (m) =>
      m.media_kind === 'image' &&
      m.published &&
      m.placement !== 'floor_plan' &&
      m.placement !== 'unit_render',
  )

  const development = applyPropertyTurnoverSchedule(
    mapDbDevelopment(row, galleryForMap),
  )

  const overviewMedia = row.overview_media_id
    ? mediaById.get(row.overview_media_id)
    : undefined
  const overviewUrl = overviewMedia ? mediaPublicUrl(overviewMedia) : undefined

  const { collections: galleryCollections, legacyGallery } = groupGallery(
    collections,
    mediaList,
  )

  const certs = certifications.map((c) => {
    const logo = c.logo_media_id ? mediaById.get(c.logo_media_id) : undefined
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      logoUrl: logo ? mediaPublicUrl(logo) : undefined,
      displayOrder: c.display_order,
    }
  })

  const nearbyMapped = nearby.map((p) => ({
    id: p.id,
    category: p.category,
    name: p.name,
    distanceLabel: p.distance_label ?? undefined,
    notes: p.notes ?? undefined,
    displayOrder: p.display_order,
  }))

  const amenitiesRich = mapAmenities(joinAmenities, amenityRows, mediaById)

  const units = mapUnits(unitRows, mediaList)

  return {
    development,
    specs: mapSpecs(row, overviewUrl),
    units,
    certifications: certs,
    nearby: nearbyMapped,
    galleryCollections,
    legacyGallery:
      legacyGallery.length > 0 ? legacyGallery : development.gallery,
    amenitiesRich,
    location: {
      lat: row.map_lat ?? undefined,
      lng: row.map_lng ?? undefined,
      mapImageUrl: row.map_url ?? undefined,
      mapUrl: row.map_url ?? undefined,
      directionsUrl: row.directions_url ?? undefined,
    },
    video: {
      url: row.video_url ?? undefined,
      poster: row.video_poster ?? undefined,
      source: row.video_source === 'external' ? 'external' : 'upload',
    },
  }
}

// --- Admin CRUD (property detail entities) ---

export async function createDevelopment(input: {
  slug: string
  name: string
  location?: string
  region?: string
}): Promise<DbDevelopment> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const payload = {
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    name: input.name.trim(),
    location: input.location ?? 'TBD',
    region: input.region ?? 'Metro Cebu',
    type: 'Residential Condominium',
    property_type: 'Residential Condominium',
    category: 'residential',
    status: 'Inquire for Availability',
    availability_status: 'Inquire for Availability',
    price_label: 'Inquire for pricing',
    publication_status: 'draft' as const,
    published: false,
    display_order: 99,
    amenities: [],
    sustainability: [],
  }
  const { data, error } = await supabase.from('developments').insert(payload).select('*').single()
  if (error) throw error
  return data as DbDevelopment
}

export async function fetchAdminGalleryCollections(
  slug: string,
): Promise<DbGalleryCollection[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_gallery_collections')
    .select('*')
    .eq('development_slug', slug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbGalleryCollection[]
}

export async function upsertGalleryCollection(
  row: Omit<DbGalleryCollection, 'created_at' | 'updated_at'> & { id?: string },
): Promise<DbGalleryCollection> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('cms_gallery_collections')
    .upsert({ ...row, updated_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw error
  return data as DbGalleryCollection
}

export async function deleteGalleryCollection(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('cms_gallery_collections').delete().eq('id', id)
  if (error) throw error
}

export async function fetchAdminCertifications(
  slug: string,
): Promise<DbDevelopmentCertification[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_development_certifications')
    .select('*')
    .eq('development_slug', slug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbDevelopmentCertification[]
}

export async function upsertCertification(
  row: Omit<DbDevelopmentCertification, 'created_at' | 'updated_at'> & { id?: string },
): Promise<DbDevelopmentCertification> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('cms_development_certifications')
    .upsert({ ...row, updated_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw error
  return data as DbDevelopmentCertification
}

export async function deleteCertification(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from('cms_development_certifications')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function fetchAdminNearbyPlaces(
  slug: string,
): Promise<DbDevelopmentNearbyPlace[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_development_nearby_places')
    .select('*')
    .eq('development_slug', slug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbDevelopmentNearbyPlace[]
}

export async function upsertNearbyPlace(
  row: Omit<DbDevelopmentNearbyPlace, 'created_at' | 'updated_at'> & { id?: string },
): Promise<DbDevelopmentNearbyPlace> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('cms_development_nearby_places')
    .upsert({ ...row, updated_at: new Date().toISOString() })
    .select('*')
    .single()
  if (error) throw error
  return data as DbDevelopmentNearbyPlace
}

export async function deleteNearbyPlace(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('cms_development_nearby_places').delete().eq('id', id)
  if (error) throw error
}

export async function assignMediaToCollection(
  mediaId: string,
  collectionId: string | null,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from('cms_media')
    .update({
      gallery_collection_id: collectionId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mediaId)
  if (error) throw error
}

/** Back-compat wrapper used by existing hooks. */
export async function fetchPublicPropertyDetailAggregated(
  slug: string,
): Promise<{ development: Development; units: UnitType[] } | null> {
  const page = await fetchPublicPropertyPageData(slug)
  if (!page) return null
  return { development: page.development, units: page.units }
}
