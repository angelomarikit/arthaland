export type PublicationStatus = 'published' | 'draft' | 'coming_soon' | 'archived'

export type CertificationStatus = 'registered' | 'on_track' | 'targeted' | 'certified'

export type NearbyCategory =
  | 'schools'
  | 'shopping'
  | 'healthcare'
  | 'parks'
  | 'transport'
  | 'business'
  | 'dining'
  | 'other'

export type UnitTabGroup =
  | 'studio'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'three_bedroom'
  | 'custom'

export type VideoSource = 'upload' | 'external'

export type DbDevelopment = {
  id: string
  slug: string
  name: string
  location: string
  region: string
  type: string
  status: string
  price_label: string
  bedrooms_range: string | null
  area_range: string | null
  featured: boolean | null
  published: boolean | null
  hero_image: string | null
  gallery: string[] | null
  summary: string | null
  overview: string | null
  amenities: string[] | null
  sustainability: string[] | null
  official_url: string | null
  category: string | null
  property_type: string | null
  publication_status: PublicationStatus | null
  availability_status: string | null
  short_description: string | null
  full_description: string | null
  cover_image: string | null
  card_image: string | null
  display_order: number | null
  uses_illustrative_imagery: boolean | null
  video_url: string | null
  video_poster: string | null
  seo: Record<string, unknown> | null
  source_note: string | null
  cover_media_id: string | null
  hero_media_id: string | null
  hero_subtitle: string | null
  total_stories: string | null
  total_units: string | null
  completion_date: string | null
  developer_name: string | null
  map_lat: number | null
  map_lng: number | null
  map_url: string | null
  directions_url: string | null
  overview_media_id: string | null
  video_source: VideoSource | null
  created_at: string | null
  updated_at: string | null
}

export type DbCmsMedia = {
  id: string
  bucket_id: 'arthaland-images' | 'arthaland-videos'
  storage_path: string
  media_kind: 'image' | 'video'
  mime_type: string | null
  byte_size: number | null
  alt_text: string | null
  caption: string | null
  focal_x: number | null
  focal_y: number | null
  published: boolean
  display_order: number
  development_id: string | null
  development_slug: string | null
  unit_type_id: string | null
  page_id: string | null
  page_section_id: string | null
  placement: string | null
  gallery_collection_id: string | null
  is_cover: boolean
  is_illustrative: boolean
  created_at: string
  updated_at: string
}

export type DbDevelopmentSection = {
  id: string
  development_id: string
  development_slug: string
  section_key: string
  section_type: string
  content: Record<string, unknown>
  published: boolean
  display_order: number
  updated_at: string
}

export type DbUnitType = {
  id: string
  development_id: string
  development_slug: string
  name: string
  area_min: number | null
  area_max: number | null
  bedrooms: string | null
  bathrooms: string | null
  publication_status: PublicationStatus
  display_order: number
  description: string | null
  features: string[] | null
  tab_group: UnitTabGroup | null
  brochure_url: string | null
  price_note: string | null
  created_at: string
  updated_at: string
}

export type DbGalleryCollection = {
  id: string
  development_id: string
  development_slug: string
  slug: string
  title: string
  description: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type DbDevelopmentCertification = {
  id: string
  development_id: string
  development_slug: string
  name: string
  status: CertificationStatus
  logo_media_id: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type DbDevelopmentNearbyPlace = {
  id: string
  development_id: string
  development_slug: string
  category: NearbyCategory
  name: string
  distance_label: string | null
  notes: string | null
  display_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type DbAmenity = {
  id: string
  name: string
  description: string | null
  media_id: string | null
  created_at: string
}

export type DbDevelopmentAmenity = {
  development_id: string
  amenity_id: string
  description: string | null
  display_order: number
}

export type DbPage = {
  id: string
  slug: string
  title: string
  published: boolean
  seo: Record<string, unknown> | null
  display_order: number
  updated_at: string
}

export type DbPageSection = {
  id: string
  page_id: string
  page_slug: string
  section_key: string
  section_type: string
  content: Record<string, unknown>
  published: boolean
  display_order: number
  updated_at: string
}

export type DbInquiry = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  development_slug: string | null
  message: string
  viewing_requested: boolean | null
  source: string | null
  status: string | null
  unit_type_id: string | null
  unit_type_name: string | null
  created_at: string
}

export type DbTeamMember = {
  id: string
  name: string
  role: string
  bio: string | null
  photo_media_id: string | null
  display_order: number
  published: boolean
  updated_at: string
}

export type DbSiteSetting = {
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export type DbFeaturedUnit = {
  id: string
  slug: string
  title: string
  development_name: string
  location: string
  unit_label: string
  price_label: string
  area_sqm: number | null
  bedrooms: string | null
  bathrooms: string | null
  floor: string | null
  description: string
  highlights: string[] | null
  hero_image: string | null
  gallery: string[] | null
  status: string
  published: boolean
  display_order: number
  created_at: string
  updated_at: string
}
