import type {
  Amenity,
  Development,
  PublicationStatus,
  UnitTabGroup,
  UnitType,
} from '../development/types'

export type CertificationStatus = 'registered' | 'on_track' | 'targeted' | 'certified'

export type PropertyCertification = {
  id: string
  name: string
  status: CertificationStatus
  logoUrl?: string
  displayOrder: number
}

export type NearbyCategory =
  | 'schools'
  | 'shopping'
  | 'healthcare'
  | 'parks'
  | 'transport'
  | 'business'
  | 'dining'
  | 'other'

export type NearbyPlace = {
  id: string
  category: NearbyCategory
  name: string
  distanceLabel?: string
  notes?: string
  displayOrder: number
}

export type GalleryCollection = {
  id: string
  slug: string
  title: string
  description?: string
  displayOrder: number
  images: { id: string; url: string; alt: string; caption?: string }[]
}

export type PropertyLocationInfo = {
  lat?: number
  lng?: number
  mapImageUrl?: string
  mapUrl?: string
  directionsUrl?: string
}

export type PropertyVideoInfo = {
  url?: string
  poster?: string
  source: 'upload' | 'external'
}

export type PropertySpecs = {
  heroSubtitle?: string
  totalStories?: string
  totalUnits?: string
  completionDate?: string
  developerName?: string
  overviewImageUrl?: string
}

export type PropertyPageData = {
  development: Development
  specs: PropertySpecs
  units: UnitType[]
  certifications: PropertyCertification[]
  nearby: NearbyPlace[]
  galleryCollections: GalleryCollection[]
  /** Flat gallery when no collections or unassigned media */
  legacyGallery: string[]
  amenitiesRich: Amenity[]
  location: PropertyLocationInfo
  video: PropertyVideoInfo
}

export const CERTIFICATION_STATUS_LABEL: Record<CertificationStatus, string> = {
  registered: 'Registered',
  on_track: 'On track',
  targeted: 'Targeted',
  certified: 'Certified',
}

export const NEARBY_CATEGORY_LABEL: Record<NearbyCategory, string> = {
  schools: 'Schools',
  shopping: 'Shopping',
  healthcare: 'Healthcare',
  parks: 'Parks',
  transport: 'Transport',
  business: 'Business',
  dining: 'Dining',
  other: 'Nearby',
}

export const UNIT_TAB_LABEL: Record<UnitTabGroup, string> = {
  studio: 'Studio',
  one_bedroom: '1 bedroom',
  two_bedroom: '2 bedroom',
  three_bedroom: '3 bedroom',
  custom: 'Units',
}

export const UNIT_TAB_ORDER: UnitTabGroup[] = [
  'studio',
  'one_bedroom',
  'two_bedroom',
  'three_bedroom',
  'custom',
]

export type InquiryUnitOption = {
  id: string
  name: string
  publicationStatus: PublicationStatus
}
