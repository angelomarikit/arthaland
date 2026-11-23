import type { DbCmsMedia } from '../supabase/database.types'

const LAYOUT_PLACEMENTS = new Set(['floor_plan', 'unit_render'])

export function isLayoutPlacement(placement: string | null | undefined): boolean {
  return LAYOUT_PLACEMENTS.has((placement ?? '').toLowerCase())
}

/** Recover unit id when cms_media.unit_type_id was not set (legacy uploads). */
export function inferUnitTypeIdFromMedia(m: DbCmsMedia): string | null {
  if (m.unit_type_id) return m.unit_type_id
  const path = m.storage_path ?? ''
  const fromUnitsFolder = path.match(/\/units\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\//i)
  if (fromUnitsFolder) return fromUnitsFolder[1]!
  return null
}

export function resolveUnitTypeIdForMedia(m: DbCmsMedia): string | null {
  return inferUnitTypeIdFromMedia(m)
}