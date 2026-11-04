export type FeaturedUnitStatus = 'available' | 'reserved' | 'sold'

export type FeaturedUnit = {
  id: string
  slug: string
  /** Shown on site as format examples until replaced by real CMS listings. */
  isSampleGuide?: boolean
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
  published: boolean
  displayOrder: number
  status: FeaturedUnitStatus
  createdAt: string
  updatedAt: string
}
