import type { DbCmsMedia } from '../supabase/database.types'

const LAYOUT_PLACEMENTS = new Set(['floor_plan', 'unit_render'])

export function isLayoutPlacement(placement: string | null | undefined): boolean {
  return LAYOUT_PLACEMENTS.has((placement ?? '').toLowerCase())
}

function storagePathLooksLikeLayout(path: string): boolean {
  const p = path.toLowerCase()
  if (!p) return false
  return (
    p.includes('floor-plan') ||
    p.includes('floor_plan') ||
    p.includes('floor-plans') ||
    (p.includes('/units/') && (p.includes('/render') || p.includes('floor')))
  )
}

/** Layout-ish images for the public Unit layouts block (not hero/gallery). */
export function isLayoutMediaForPublic(m: DbCmsMedia): boolean {
  if (m.media_kind !== 'image') return false
  if (isLayoutPlacement(m.placement)) return true
  return storagePathLooksLikeLayout(m.storage_path ?? '')
}

export function layoutMediaRole(m: DbCmsMedia): 'floor' | 'render' {
  if (m.placement === 'unit_render') return 'render'
  if (m.placement === 'floor_plan') return 'floor'
  if (storagePathLooksLikeLayout(m.storage_path ?? '') && !m.placement) return 'floor'
  return 'floor'
}

/** Recover unit id when cms_media.unit_type_id was not set (legacy uploads). */
export function inferUnitTypeIdFromMedia(m: DbCmsMedia): string | null {
  if (m.unit_type_id) return m.unit_type_id
  const path = m.storage_path ?? ''
  const fromUnitsFolder = path.match(
    /\/units\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\//i,
  )
  if (fromUnitsFolder) return fromUnitsFolder[1]!
  return null
}

export function resolveUnitTypeIdForMedia(m: DbCmsMedia): string | null {
  return inferUnitTypeIdFromMedia(m)
}