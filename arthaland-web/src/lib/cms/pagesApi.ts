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

/** Creates or updates a section row (for first-time saves from the admin editor). */
export async function upsertPageSection(args: {
  pageSlug: string
  sectionKey: string
  sectionType: string
  content: Record<string, unknown>
  published: boolean
  displayOrder?: number
}): Promise<string> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('slug', args.pageSlug)
    .maybeSingle()
  if (pageError) throw pageError
  if (!page) {
    throw new Error(
      `Page “${args.pageSlug}” is not in the CMS yet. Run the Supabase CMS migration (002_full_cms.sql).`,
    )
  }

  const { data, error } = await supabase
    .from('cms_page_sections')
    .upsert(
      {
        page_id: page.id,
        page_slug: args.pageSlug,
        section_key: args.sectionKey,
        section_type: args.sectionType,
        content: args.content,
        published: args.published,
        display_order: args.displayOrder ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'page_slug,section_key' },
    )
    .select('id')
    .single()

  if (error) throw error
  return data.id
}
