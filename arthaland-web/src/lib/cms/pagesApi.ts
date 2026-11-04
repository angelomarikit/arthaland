import { getSupabaseClient } from '../supabase/client'
import type { DbPage, DbPageSection } from '../supabase/database.types'

export async function fetchAdminPages(): Promise<DbPage[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbPage[]
}

export async function fetchPageSections(pageSlug: string): Promise<DbPageSection[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('cms_page_sections')
    .select('*')
    .eq('page_slug', pageSlug)
    .order('display_order')
  if (error) throw error
  return (data ?? []) as DbPageSection[]
}

export async function updatePageSection(
  id: string,
  patch: Partial<Pick<DbPageSection, 'content' | 'published' | 'display_order'>>,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from('cms_page_sections')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
