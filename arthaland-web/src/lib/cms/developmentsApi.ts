import type { Development } from '../../domain/development/types'
import { getSupabaseClient } from '../supabase/client'
import type {
  DbCmsMedia,
  DbDevelopment,
  DbDevelopmentSection,
  DbInquiry,
  DbUnitType,
} from '../supabase/database.types'
import { mapDbDevelopment } from './mapDevelopment'

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

export async function fetchPublicDevelopmentBySlug(
  slug: string,
): Promise<Development | null> {
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

  const { data: media } = await supabase
    .from('cms_media')
    .select('*')
    .eq('development_slug', slug)
    .eq('published', true)
    .order('display_order')

  return mapDbDevelopment(data as DbDevelopment, (media ?? []) as DbCmsMedia[])
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
