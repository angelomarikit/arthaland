import type {
  GallerySectionContent,
  HeroSectionContent,
  HomeGalleryItem,
  HomeLifestyleItem,
  LifestyleSectionContent,
} from '../../domain/home/types'
import { getLivePageSections } from '../../config/pageContentRegistry'
import { fetchPageSections, upsertPageSection, updatePageSection } from './pagesApi'

const HOME = 'home'

export async function loadHomeSectionRow(sectionKey: string) {
  const rows = await fetchPageSections(HOME)
  const row = rows.find((r) => r.section_key === sectionKey)
  const live = getLivePageSections(HOME).find((s) => s.sectionKey === sectionKey)
  return {
    row,
    live,
    content: (row?.content ?? live?.content ?? {}) as Record<string, unknown>,
    published: row?.published ?? true,
    sectionId: row?.id ?? '',
    sectionType: row?.section_type ?? live?.sectionType ?? 'richtext',
    displayOrder: row?.display_order ?? live?.displayOrder ?? 0,
  }
}

export async function saveHomeSectionContent(
  sectionKey: string,
  sectionType: string,
  content: Record<string, unknown>,
  published: boolean,
  displayOrder: number,
  sectionId?: string,
): Promise<string> {
  if (sectionId) {
    await updatePageSection(sectionId, { content, published })
    return sectionId
  }
  return upsertPageSection({
    pageSlug: HOME,
    sectionKey,
    sectionType,
    content,
    published,
    displayOrder,
  })
}

export async function loadHeroSection(): Promise<{
  sectionId: string
  content: HeroSectionContent
}> {
  const { content, sectionId } = await loadHomeSectionRow('hero')
  return { sectionId, content: content as HeroSectionContent }
}

export async function saveHeroSection(
  content: HeroSectionContent,
  published: boolean,
  sectionId?: string,
) {
  return saveHomeSectionContent('hero', 'hero', content, published, 1, sectionId)
}

export async function loadGallerySection(): Promise<
  GallerySectionContent & { sectionId: string; items: HomeGalleryItem[] }
> {
  const { content, sectionId } = await loadHomeSectionRow('gallery')
  const typed = content as GallerySectionContent
  const items = Array.isArray(typed.items) ? (typed.items as HomeGalleryItem[]) : []
  return { ...typed, sectionId, items }
}

export async function saveGallerySection(
  content: GallerySectionContent,
  published: boolean,
  sectionId?: string,
) {
  return saveHomeSectionContent('gallery', 'gallery', content, published, 6, sectionId)
}

export async function loadLifestyleSection(): Promise<
  LifestyleSectionContent & { sectionId: string; items: HomeLifestyleItem[] }
> {
  const { content, sectionId } = await loadHomeSectionRow('lifestyle')
  const typed = content as LifestyleSectionContent
  const items = Array.isArray(typed.items) ? (typed.items as HomeLifestyleItem[]) : []
  return { ...typed, sectionId, items }
}

export async function saveLifestyleSection(
  content: LifestyleSectionContent,
  published: boolean,
  sectionId?: string,
) {
  return saveHomeSectionContent('lifestyle', 'richtext', content, published, 5, sectionId)
}
