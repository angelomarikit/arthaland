import type { DbCmsMedia } from '../supabase/database.types'

/** Never show these in the property photo gallery (unit layouts, certs, hero, etc.). */
const NON_GALLERY_PLACEMENTS = new Set([
  'floor_plan',
  'unit_render',
  'hero',
  'certification',
  'overview',
  'map',
  'showcase_video',
  'showcase_video_poster',
  'home-section',
])

const CERT_LOGO_HINT =
  /\b(leed|well(?:\s*core)?|berde|edge)\b|leadership in energy|building for ecologically responsive|excellence in design for greater/i

/** Certification / badge artwork stored under these path segments (Supabase or static). */
function storagePathLooksNonGallery(path: string): boolean {
  const p = path.toLowerCase()
  if (!p) return false
  if (p.includes('/certifications/') || p.includes('/certification/')) return true
  if (p.includes('/floor-plans/') || p.includes('/floor_plans/')) return true
  if (p.includes('/units/') && (p.includes('/floor') || p.includes('/render'))) return true
  if (p.includes('/assets/certifications/')) return true
  return false
}

export function isLikelyCertificationGalleryUrl(url: string): boolean {
  const u = url.toLowerCase()
  if (!u) return false
  if (u.includes('/certifications/') || u.includes('/assets/certifications/')) return true
  if (CERT_LOGO_HINT.test(u)) return true
  return false
}

export function filterPropertyGalleryUrls(urls: string[]): string[] {
  return urls.filter((url) => !isLikelyCertificationGalleryUrl(url))
}

function mediaTextLooksLikeCertBadge(m: DbCmsMedia): boolean {
  const text = [m.alt_text, m.caption, m.storage_path]
    .filter(Boolean)
    .join(' ')
  if (!text) return false
  if (storagePathLooksNonGallery(text)) return true
  if (CERT_LOGO_HINT.test(text) && !/\b(facade|tower|bedroom|interior|exterior|amenity)\b/i.test(text)) {
    return true
  }
  return false
}

/**
 * Images eligible for the property gallery tab (facade, amenities, interiors).
 * Excludes logos and assets linked elsewhere on the page.
 */
export function isPropertyGalleryMedia(
  m: DbCmsMedia,
  reservedMediaIds?: ReadonlySet<string>,
  options?: { requirePublished?: boolean },
): boolean {
  const requirePublished = options?.requirePublished !== false
  if (m.media_kind !== 'image') return false
  if (requirePublished && !m.published) return false
  if (reservedMediaIds?.has(m.id)) return false
  const placement = (m.placement ?? '').toLowerCase()
  if (NON_GALLERY_PLACEMENTS.has(placement)) return false
  if (storagePathLooksNonGallery(m.storage_path ?? '')) return false
  if (mediaTextLooksLikeCertBadge(m)) return false
  return true
}