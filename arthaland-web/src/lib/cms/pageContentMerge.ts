import {
  getLivePageSections,
  type PageSectionContent,
} from '../../config/pageContentRegistry'
import type { DbPageSection } from '../supabase/database.types'

function hasCmsContent(content: unknown): boolean {
  if (!content || typeof content !== 'object') return false
  const c = content as PageSectionContent
  if (Array.isArray(c.items) && c.items.length > 0) return true
  return [
    c.eyebrow,
    c.title,
    c.subtitle,
    c.body,
    c.imageUrl,
    c.posterImageUrl,
    c.videoDesktopUrl,
    c.videoMobileUrl,
    c.posterObjectPosition,
    c.videoObjectPosition,
    c.coverImageUrl,
    c.imageObjectPosition,
  ].some((v) => typeof v === 'string' && v.trim().length > 0)
}

export function mergeSectionContent(
  defaults: PageSectionContent,
  cms?: PageSectionContent | null,
): PageSectionContent {
  if (!cms) return { ...defaults }
  const pick = (cmsVal: string | undefined, defVal: string | undefined) =>
    cmsVal?.trim() ? cmsVal.trim() : defVal
  return {
    eyebrow: pick(cms.eyebrow, defaults.eyebrow),
    title: pick(cms.title, defaults.title),
    subtitle: pick(cms.subtitle, defaults.subtitle),
    body: pick(cms.body, defaults.body),
    imageUrl: pick(cms.imageUrl, defaults.imageUrl),
    posterImageUrl: pick(cms.posterImageUrl, defaults.posterImageUrl),
    videoDesktopUrl: pick(cms.videoDesktopUrl, defaults.videoDesktopUrl),
    videoMobileUrl: pick(cms.videoMobileUrl, defaults.videoMobileUrl),
    posterObjectPosition: pick(cms.posterObjectPosition, defaults.posterObjectPosition),
    videoObjectPosition: pick(cms.videoObjectPosition, defaults.videoObjectPosition),
    coverImageUrl: pick(cms.coverImageUrl, defaults.coverImageUrl),
    imageObjectFit: cms.imageObjectFit ?? defaults.imageObjectFit,
    imageObjectPosition: pick(cms.imageObjectPosition, defaults.imageObjectPosition),
    imageLayout: cms.imageLayout ?? defaults.imageLayout,
    items:
      Array.isArray(cms.items) && cms.items.length > 0
        ? cms.items
        : defaults.items,
  }
}

export function buildMergedSectionMap(
  pageSlug: string,
  dbRows: DbPageSection[],
): Record<string, PageSectionContent> {
  const live = getLivePageSections(pageSlug)
  const map: Record<string, PageSectionContent> = {}

  for (const section of live) {
    map[section.sectionKey] = { ...section.content }
  }

  for (const row of dbRows) {
    if (!hasCmsContent(row.content)) continue
    const defaults = map[row.section_key] ?? {}
    map[row.section_key] = mergeSectionContent(
      defaults,
      row.content as PageSectionContent,
    )
  }

  return map
}

/** Split CMS titles for multi-line heroes (use \\n in admin). */
export function titleToDisplayLines(
  title: string | undefined,
  fallbackLines: string[],
): string[] {
  if (!title?.trim()) return fallbackLines
  if (title.includes('\n')) {
    return title
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return [title.trim()]
}
