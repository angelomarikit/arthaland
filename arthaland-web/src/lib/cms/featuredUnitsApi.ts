import {
  featuredUnitsSeed,
  getFeaturedUnitGuideSamples,
} from '../../data/seed/featuredUnits.seed'
import type { FeaturedUnit, FeaturedUnitStatus } from '../../domain/featuredUnit/types'
import { getSupabaseClient } from '../supabase/client'
import type { DbFeaturedUnit } from '../supabase/database.types'

function mapRow(row: DbFeaturedUnit): FeaturedUnit {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    developmentName: row.development_name,
    location: row.location ?? '',
    unitLabel: row.unit_label ?? '',
    priceLabel: row.price_label ?? 'Price upon request',
    areaSqm: row.area_sqm != null ? Number(row.area_sqm) : undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    floor: row.floor ?? undefined,
    description: row.description ?? '',
    highlights: row.highlights ?? [],
    heroImage: row.hero_image ?? '',
    gallery: row.gallery ?? [],
    published: row.published,
    displayOrder: row.display_order ?? 0,
    status: (row.status as FeaturedUnitStatus) ?? 'available',
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

function mergeGuideWithListings(dbRows: FeaturedUnit[]): FeaturedUnit[] {
  const guides = getFeaturedUnitGuideSamples()
  const guideSlugs = new Set(guides.map((g) => g.slug))
  const fromDb = dbRows.filter((r) => !guideSlugs.has(r.slug))
  return [...guides, ...fromDb].sort((a, b) => {
    if (a.isSampleGuide && !b.isSampleGuide) return -1
    if (!a.isSampleGuide && b.isSampleGuide) return 1
    return a.displayOrder - b.displayOrder
  })
}

export async function fetchPublicFeaturedUnits(): Promise<FeaturedUnit[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return getFeaturedUnitGuideSamples()

  const { data, error } = await supabase
    .from('featured_units')
    .select('*')
    .eq('published', true)
    .neq('status', 'sold')
    .order('display_order', { ascending: true })

  if (error) throw error
  const rows = ((data ?? []) as DbFeaturedUnit[]).map(mapRow)
  return mergeGuideWithListings(rows)
}

export async function fetchFeaturedUnitBySlug(slug: string): Promise<FeaturedUnit | null> {
  const sample =
    featuredUnitsSeed.find((u) => u.slug === slug && u.published) ?? null
  const supabase = getSupabaseClient()
  if (!supabase) return sample

  const { data, error } = await supabase
    .from('featured_units')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) throw error
  if (data) return mapRow(data as DbFeaturedUnit)
  return sample
}

export async function fetchAdminFeaturedUnits(): Promise<FeaturedUnit[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return featuredUnitsSeed

  const { data, error } = await supabase
    .from('featured_units')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return ((data ?? []) as DbFeaturedUnit[]).map(mapRow)
}

export async function fetchAdminFeaturedUnit(id: string): Promise<FeaturedUnit | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return featuredUnitsSeed.find((u) => u.id === id) ?? null

  const { data, error } = await supabase.from('featured_units').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapRow(data as DbFeaturedUnit) : null
}

export type FeaturedUnitInput = {
  slug: string
  title: string
  developmentName: string
  location: string
  unitLabel: string
  priceLabel: string
  areaSqm?: number
  bedrooms?: string
  bathrooms?: string
  floor?: string
  description: string
  highlights: string[]
  heroImage: string
  gallery: string[]
  status: FeaturedUnitStatus
  published: boolean
  displayOrder: number
}

function toDbPayload(input: FeaturedUnitInput) {
  return {
    slug: input.slug,
    title: input.title,
    development_name: input.developmentName,
    location: input.location,
    unit_label: input.unitLabel,
    price_label: input.priceLabel,
    area_sqm: input.areaSqm ?? null,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    floor: input.floor ?? null,
    description: input.description,
    highlights: input.highlights,
    hero_image: input.heroImage || null,
    gallery: input.gallery,
    status: input.status,
    published: input.published,
    display_order: input.displayOrder,
    updated_at: new Date().toISOString(),
  }
}

export async function createFeaturedUnit(input: FeaturedUnitInput): Promise<string> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data, error } = await supabase
    .from('featured_units')
    .insert(toDbPayload(input))
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

export async function updateFeaturedUnit(id: string, input: FeaturedUnitInput): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('featured_units').update(toDbPayload(input)).eq('id', id)
  if (error) throw error
}

export async function deleteFeaturedUnit(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('featured_units').delete().eq('id', id)
  if (error) throw error
}
