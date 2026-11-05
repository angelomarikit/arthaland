/** Sales / construction availability (verified labels only). */
export type AvailabilityStatus =
  | 'Pre-Selling'
  | 'Under Construction'
  | 'Completed'
  | 'Inquire for Availability'

export type PublicationStatus = 'published' | 'draft' | 'coming_soon'

export type DevelopmentCategory = 'residential' | 'commercial' | 'mixed-use'

/** Legacy display subtype for filters and cards. */
export type PropertyType =
  | 'Residential Condominium'
  | 'Mixed-Use'
  | 'Villa'
  | 'Apartment'
  | 'Commercial Office'
  | 'Commercial Retail'

export type MediaType =
  | 'image'
  | 'video'
  | 'floor_plan'
  | 'thumbnail'
  | 'hero'
  | 'cover'
  | 'card'

export interface DevelopmentSEO {
  title?: string
  description?: string
  ogImage?: string
}

export type TurnoverMilestone = {
  label: string
  date: string
}

/** Sales / construction turnover timing shown on property detail pages. */
export type TurnoverSchedule = {
  /** Short line for hero or cards, e.g. "Estimated turnover Q3 2031". */
  summary?: string
  milestones: TurnoverMilestone[]
}

export interface DevelopmentRecord {
  id: string
  slug: string
  name: string
  category: DevelopmentCategory
  propertyType: PropertyType
  location: string
  region: string
  shortDescription: string
  fullDescription: string
  coverImage: string
  heroImage: string
  cardImage: string
  publicationStatus: PublicationStatus
  availabilityStatus: AvailabilityStatus
  priceLabel: string
  featured: boolean
  displayOrder: number
  bedroomsRange?: string
  areaRange?: string
  amenities: string[]
  sustainability: string[]
  officialUrl: string
  sourceNote?: string
  /** True when card/hero uses non-property-specific editorial placeholder */
  usesIllustrativeImagery?: boolean
  videoUrl?: string
  videoPoster?: string
  seo?: DevelopmentSEO
  turnoverSchedule?: TurnoverSchedule
  createdAt: string
  updatedAt: string
}

export interface DevelopmentMedia {
  id: string
  developmentId: string
  unitTypeId?: string
  mediaType: MediaType
  storagePath: string
  publicUrl: string
  altText: string
  caption?: string
  displayOrder: number
  isCover: boolean
  isIllustrative?: boolean
}

export interface UnitType {
  id: string
  developmentId: string
  name: string
  areaMin?: number
  areaMax?: number
  bedrooms?: string
  bathrooms?: string
  floorPlanImages: string[]
  publicationStatus: PublicationStatus
  displayOrder: number
}

export interface Amenity {
  id: string
  name: string
  description?: string
  imageUrl?: string
}

export interface DevelopmentAmenity {
  developmentId: string
  amenityId: string
  description?: string
}

/** View model with legacy aliases used across existing components. */
export type Development = DevelopmentRecord & {
  summary: string
  overview: string
  published: boolean
  status: AvailabilityStatus
  type: PropertyType
  heroImage: string
  gallery: string[]
}
