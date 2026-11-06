import type { Development, UnitType } from '../../domain/development/types'
import { getSupabaseClient } from '../supabase/client'
import type {
  DbCmsMedia,
  DbDevelopment,
  DbDevelopmentSection,
  DbInquiry,
  DbUnitType,
} from '../supabase/database.types'
import { mapDbDevelopment, mapDbUnitType } from './mapDevelopment'
import { mediaPublicUrl } from './mediaUpload'

export async function fetchPublicDevelopments(): Promise<Development[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('developments')
    .select('*')
    .in('publication_status', ['published', 'coming_soon'])
    .order('display_order', { ascending: true })

  if (error) throw error
  const rows = (data ?? []) as DbDevelopment[]
  return rows.map((r) => mapDbDevelopment(r))
}

/** Published property detail: development + unit types with floor-plan URLs from `cms_media`. */
export async function fetchPublicPropertyDetail(
  slug: string,
): Promise<{ development: Development; units: UnitType[] } | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

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

  const [{ data: media }, { data: unitRows }] = await Promise.all([
    supabase
      .from('cms_media')
      .select('*')
      .eq('development_slug', developmentSlug)
      .eq('published', true)
      .order('display_order'),
    supabase
      .from('cms_unit_types')
      .select('*')
      .eq('development_slug', developmentSlug)
      .in('publication_status', ['published', 'coming_soon'])
      .order('display_order'),
  ])

  const mediaList = (media ?? []) as DbCmsMedia[]
  const galleryForMap = mediaList.filter(
    (m) =>
      m.media_kind === 'image' &&
      m.published &&
      m.placement !== 'floor_plan',
  )

  const development = mapDbDevelopment(row, galleryForMap)

  const floorByUnit = new Map<string, DbCmsMedia[]>()
  for (const m of mediaList) {
    if (m.placement === 'floor_plan' && m.unit_type_id) {
      const list = floorByUnit.get(m.unit_type_id) ?? []
      list.push(m)
      floorByUnit.set(m.unit_type_id, list)
    }
  }

  const units = (unitRows ?? []).map((u) => {
    const row = u as DbUnitType
    const floors = (floorByUnit.get(row.id) ?? []).sort(
      (a, b) => a.display_order - b.display_order,
    )
    return mapDbUnitType(row, floors.map((m) => mediaPublicUrl(m)))
  })

  return { development, units }
}

export async function fetchPublicDevelopmentBySlug(
  slug: string,
): Promise<Development | null> {
  const detail = await fetchPublicPropertyDetail(slug)
  return detail?.development ?? null
}

export async function fetchAdminDevelopments(): Promise<DbDevelopment[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('developments')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as DbDevelopment[]
}

export async function fetchAdminDevelopment(slug: string): Promise<DbDevelopment | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('developments')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data as DbDevelopment | null
}

export type DevelopmentPatch = Partial<
  Pick<
    DbDevelopment,
    | 'name'
    | 'location'
    | 'region'
    | 'category'
    | 'property_type'
    | 'publication_status'
    | 'availability_status'
    | 'short_description'
    | 'full_description'
    | 'price_label'
    | 'featured'
    | 'display_order'
    | 'uses_illustrative_imagery'
    | 'official_url'
    | 'source_note'
    | 'amenities'
    | 'sustainability'
    | 'bedrooms_range'
    | 'area_range'
    | 'video_url'
    | 'video_poster'
    | 'seo'
    | 'published'
    | 'cover_image'
    | 'card_image'
    | 'hero_image'
  >
>

export async function updateDevelopment(
  id: string,
  patch: DevelopmentPatch,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const payload = {
    ...patch,
    updated_at: new Date().toISOString(),
    published: patch.publication_status
      ? patch.publication_status === 'published'
      : patch.published,
  }
  const { error } = await supabase.from('developments').update(payload).eq('id', id)
  if (error) throw error
}

export async function fetchDevelopmentSections(
  slug: string,
): Promise<DbDevelopmentSection[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_development_sections')
    .select('*')
    .eq('development_slug', slug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbDevelopmentSection[]
}

export async function updateDevelopmentSection(
  id: string,
  patch: Partial<Pick<DbDevelopmentSection, 'content' | 'published' | 'display_order'>>,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from('cms_development_sections')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function fetchDevelopmentMedia(slug: string): Promise<DbCmsMedia[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_media')
    .select('*')
    .eq('development_slug', slug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbCmsMedia[]
}

export async function updateMediaRow(
  id: string,
  patch: Partial<
    Pick<
      DbCmsMedia,
      'alt_text' | 'caption' | 'display_order' | 'published' | 'is_cover' | 'focal_x' | 'focal_y'
    >
  >,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from('cms_media')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function fetchUnitTypes(slug: string): Promise<DbUnitType[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_unit_types')
    .select('*')
    .eq('development_slug', slug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbUnitType[]
}

export async function upsertUnitType(
  row: Omit<DbUnitType, 'created_at' | 'updated_at'> & { id?: string },
): Promise<DbUnitType> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const payload = { ...row, updated_at: new Date().toISOString() }
  const { data, error } = await supabase
    .from('cms_unit_types')
    .upsert(payload)
    .select('*')
    .single()
  if (error) throw error
  return data as DbUnitType
}

export async function fetchInquiries(limit = 50): Promise<DbInquiry[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as DbInquiry[]
}

export async function updateInquiryStatus(id: string, status: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
  if (error) throw error
}

export async function fetchDashboardStats(): Promise<{
  totalProperties: number
  published: number
  draft: number
  recentInquiries: number
  missingHero: number
}> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return {
      totalProperties: 0,
      published: 0,
      draft: 0,
      recentInquiries: 0,
      missingHero: 0,
    }
  }

  const { data: devs, error: dErr } = await supabase.from('developments').select('publication_status, hero_image')
  if (dErr) throw dErr
  const rows = devs ?? []
  const published = rows.filter((r) => r.publication_status === 'published').length
  const draft = rows.filter((r) => r.publication_status === 'draft').length
  const missingHero = rows.filter((r) => !r.hero_image).length

  const since = new Date(Date.now() - 7 * 864e5).toISOString()
  const { count, error: iErr } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since)
  if (iErr) throw iErr

  return {
    totalProperties: rows.length,
    published,
    draft,
    recentInquiries: count ?? 0,
    missingHero,
  }
}

export async function fetchInquiryAnalytics(): Promise<{
  totalAllTime: number
  last14Days: { label: string; value: number }[]
  byDevelopment: { label: string; value: number }[]
  bySource: { label: string; value: number }[]
}> {
  const empty = {
    totalAllTime: 0,
    last14Days: [] as { label: string; value: number }[],
    byDevelopment: [] as { label: string; value: number }[],
    bySource: [] as { label: string; value: number }[],
  }
  const supabase = getSupabaseClient()
  if (!supabase) return empty

  const since = new Date(Date.now() - 14 * 864e5).toISOString()
  const { data, error } = await supabase
    .from('inquiries')
    .select('created_at, development_slug, source')
    .gte('created_at', since)
    .order('created_at', { ascending: true })

  if (error) throw error
  const rows = data ?? []

  const { count: totalAllTime } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })

  const dayBuckets: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    dayBuckets[key] = 0
  }
  for (const row of rows) {
    const key = new Date(row.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    if (key in dayBuckets) dayBuckets[key] += 1
  }

  const devCounts: Record<string, number> = {}
  const srcCounts: Record<string, number> = {}
  for (const row of rows) {
    const dev = row.development_slug || 'General / not specified'
    devCounts[dev] = (devCounts[dev] ?? 0) + 1
    const src = row.source || 'website'
    srcCounts[src] = (srcCounts[src] ?? 0) + 1
  }

  return {
    totalAllTime: totalAllTime ?? 0,
    last14Days: Object.entries(dayBuckets).map(([label, value]) => ({ label, value })),
    byDevelopment: Object.entries(devCounts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    bySource: Object.entries(srcCounts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value),
  }
}
