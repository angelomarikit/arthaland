import { useMemo } from 'react'
import { defaultHomeLifestyleItems } from '../config/homeContentDefaults'
import type { HomeLifestyleItem, LifestyleSectionContent } from '../domain/home/types'
import { usePageSection } from '../contexts/PageContentContext'

export function useHomeLifestyleItems(): HomeLifestyleItem[] {
  const copy = usePageSection('lifestyle') as LifestyleSectionContent
  return useMemo(() => {
    const raw = copy.items
    if (Array.isArray(raw) && raw.length > 0) {
      return (raw as HomeLifestyleItem[])
        .filter((i) => i.published !== false && i.imageUrl)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    }
    return defaultHomeLifestyleItems
  }, [copy.items, copy.title])
}
