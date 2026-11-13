import { useMemo } from 'react'
import { defaultHomeGalleryItems } from '../config/homeContentDefaults'
import type { HomeGalleryItem } from '../domain/home/types'
import type { GallerySectionContent } from '../domain/home/types'
import { usePageSection } from '../contexts/PageContentContext'

export function useHomeGalleryItems(): HomeGalleryItem[] {
  const copy = usePageSection('gallery') as GallerySectionContent
  return useMemo(() => {
    const raw = copy.items
    if (Array.isArray(raw) && raw.length > 0) {
      return (raw as HomeGalleryItem[])
        .filter((i) => i.published !== false && i.imageUrl)
        .sort((a, b) => a.displayOrder - b.displayOrder || a.column - b.column)
    }
    return defaultHomeGalleryItems
  }, [copy.items, copy.title])
}
