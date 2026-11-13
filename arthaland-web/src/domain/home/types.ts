import type { PageSectionContent } from '../../config/pageContentRegistry'

export type HomeGalleryItem = {
  id: string
  imageUrl: string
  caption: string
  /** Masonry column 0–2 */
  column: number
  displayOrder: number
  published: boolean
  category?: string
  featured?: boolean
  mediaId?: string
  /** natural = full image, column width; cover = crop to tile */
  imageObjectFit?: 'natural' | 'cover' | 'contain'
  imageObjectPosition?: string
}

export type HomeLifestyleItem = {
  id: string
  imageUrl: string
  caption: string
  /** large = primary tile; standard = secondary */
  layout: 'large' | 'standard'
  displayOrder: number
  published: boolean
  mediaId?: string
  animationDelay?: number
}

export type HeroSectionContent = PageSectionContent & {
  posterImageUrl?: string
  videoDesktopUrl?: string
  videoMobileUrl?: string
  /** CSS object-position, e.g. `center center` or `center 40%` */
  posterObjectPosition?: string
  videoObjectPosition?: string
}

export type GallerySectionContent = PageSectionContent & {
  items?: HomeGalleryItem[]
  coverImageUrl?: string
}

export type LifestyleSectionContent = PageSectionContent & {
  items?: HomeLifestyleItem[]
}
