import { getSupabaseClient } from '../supabase/client'
import type {
  DbCmsMedia,
  DbDevelopment,
  DbGalleryCollection,
  DbUnitType,
} from '../supabase/database.types'
import { resolveUnitTypeIdForMedia, isLayoutPlacement } from './unitLayoutMedia'
import { isSupabaseCmsEnabled } from '../supabase/config'
import { fetchAdminGalleryCollections } from './propertyDetailApi'
import { isPropertyGalleryMedia } from './propertyGalleryMedia'

export type PropertyPublicAudit = {
  cmsEnabledInBuild: boolean
  publicPageReachable: boolean
  publicationStatus: string | null
  heroImageUrl: string | null
  cardImageUrl: string | null
  publishedGalleryCount: number
  unpublishedGalleryCount: number
  assignedToUnpublishedCollection: number
  unpublishedCollectionTitles: string[]
  galleryVisibleOnPublicEstimate: number
  lastUpdated: string | null
  issues: string[]
}

function galleryEligible(m: DbCmsMedia): boolean {
  return isPropertyGalleryMedia(m, undefined, { requirePublished: false })
}

/** Admin-only snapshot: what anonymous visitors can read for this slug. */
export async function auditPropertyPublicVisibility(
  slug: string,
): Promise<PropertyPublicAudit | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data: dev, error: devErr } = await supabase
    .from('developments')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (devErr) throw devErr
  if (!dev) return null

  const row = dev as DbDevelopment
  const [{ data: media }, collections, { data: unitRows }] = await Promise.all([
    supabase.from('cms_media').select('*').eq('development_slug', slug),
    fetchAdminGalleryCollections(slug).catch(() => [] as DbGalleryCollection[]),
    supabase.from('cms_unit_types').select('*').eq('development_slug', slug),
  ])
  const units = (unitRows ?? []) as DbUnitType[]

  const allMedia = (media ?? []) as DbCmsMedia[]
  const galleryRows = allMedia.filter(galleryEligible)
  const publishedGallery = galleryRows.filter((m) => m.published)
  const unpublishedGallery = galleryRows.filter((m) => !m.published)

  const collectionById = new Map(collections.map((c) => [c.id, c]))
  let assignedToUnpublishedCollection = 0
  const unpublishedCollectionTitles = new Set<string>()

  for (const m of publishedGallery) {
    if (!m.gallery_collection_id) continue
    const coll = collectionById.get(m.gallery_collection_id)
    if (coll && !coll.published) {
      assignedToUnpublishedCollection += 1
      unpublishedCollectionTitles.add(coll.title)
    }
  }

  const publicStatuses = ['published', 'coming_soon']
  const publicPageReachable = publicStatuses.includes(row.publication_status ?? '')

  const publishedCollectionIds = new Set(
    collections.filter((c) => c.published).map((c) => c.id),
  )

  const visibleInPublishedCollection = publishedGallery.filter((m) => {
    if (!m.gallery_collection_id) return true
    return publishedCollectionIds.has(m.gallery_collection_id)
  })

  const unassignedPublished = publishedGallery.filter((m) => !m.gallery_collection_id)
  const hasPublishedCollectionWithImages = collections.some(
    (c) =>
      c.published &&
      publishedGallery.some((m) => m.gallery_collection_id === c.id),
  )

  let galleryVisibleOnPublicEstimate = visibleInPublishedCollection.length
  if (!hasPublishedCollectionWithImages) {
    galleryVisibleOnPublicEstimate = publishedGallery.length
  } else {
    galleryVisibleOnPublicEstimate =
      visibleInPublishedCollection.length + unassignedPublished.length
  }

  const issues: string[] = []

  if (!isSupabaseCmsEnabled()) {
    issues.push(
      'This build uses local seed for the public site (`VITE_CMS_SOURCE` or missing Supabase env).',
    )
  }
  if (!publicPageReachable) {
    issues.push(
      `Publication status is "${row.publication_status ?? 'draft'}". Set Published or Coming soon for /properties/${slug}.`,
    )
  }
  if (!row.hero_image) {
    issues.push('No hero image on developments row — upload Hero on Overview (not Media library only).')
  }
  if (unpublishedGallery.length > 0) {
    issues.push(
      `${unpublishedGallery.length} gallery file(s) have published=false and are hidden from the public site.`,
    )
  }
  if (assignedToUnpublishedCollection > 0) {
    issues.push(
      `${assignedToUnpublishedCollection} published image(s) sit in unpublished collections (${[...unpublishedCollectionTitles].join(', ')}). Publish those collections or unassign media.`,
    )
  }

  const publishedUnits = units.filter((u) => u.publication_status === 'published')
  const layoutMedia = allMedia.filter((m) => isLayoutPlacement(m.placement))
  const orphanLayouts = layoutMedia.filter((m) => !resolveUnitTypeIdForMedia(m))
  const hiddenLayoutFiles = layoutMedia.filter((m) => !m.published)

  if (units.length === 0) {
    issues.push(
      'No unit types — floor plans cannot appear until you add units (Properties → Units), set Published, and upload floor plans there.',
    )
  } else if (publishedUnits.length === 0) {
    issues.push(
      `${units.length} unit type(s) exist but none are Published — open Units and set Visibility to Published for each layout you want live.`,
    )
  }
  if (orphanLayouts.length > 0) {
    issues.push(
      `${orphanLayouts.length} floor plan/render file(s) in Media library are not linked to a unit — assign them below or re-upload on the Units screen.`,
    )
  }
  if (hiddenLayoutFiles.length > 0) {
    issues.push(
      `${hiddenLayoutFiles.length} unit layout file(s) are not Public (published=false) — publish them on Media library or Units.`,
    )
  }
  if (publishedUnits.length > 0 && layoutMedia.length === 0) {
    issues.push('Published units exist but no floor plan or unit render images were found.')
  }

  return {
    cmsEnabledInBuild: isSupabaseCmsEnabled(),
    publicPageReachable,
    publicationStatus: row.publication_status,
    heroImageUrl: row.hero_image,
    cardImageUrl: row.card_image,
    publishedGalleryCount: publishedGallery.length,
    unpublishedGalleryCount: unpublishedGallery.length,
    assignedToUnpublishedCollection,
    unpublishedCollectionTitles: [...unpublishedCollectionTitles],
    galleryVisibleOnPublicEstimate,
    lastUpdated: row.updated_at,
    issues,
  }
}
