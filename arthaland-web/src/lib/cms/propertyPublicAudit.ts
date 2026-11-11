import { getSupabaseClient } from '../supabase/client'
import type {
  DbCmsMedia,
  DbDevelopment,
  DbGalleryCollection,
} from '../supabase/database.types'
import { isSupabaseCmsEnabled } from '../supabase/config'
import { fetchAdminGalleryCollections } from './propertyDetailApi'

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
  return (
    m.media_kind === 'image' &&
    m.placement !== 'floor_plan' &&
    m.placement !== 'unit_render' &&
    m.placement !== 'hero'
  )
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
  const [{ data: media }, collections] = await Promise.all([
    supabase.from('cms_media').select('*').eq('development_slug', slug),
    fetchAdminGalleryCollections(slug).catch(() => [] as DbGalleryCollection[]),
  ])

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
