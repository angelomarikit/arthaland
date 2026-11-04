import type { FeaturedUnit } from '../../domain/featuredUnit/types'
import { sectionImages } from '../../config/sectionImages'

const ts = '2026-01-01T00:00:00.000Z'

/** Sample listings when Supabase has no rows yet. */
export const featuredUnitsSeed: FeaturedUnit[] = [
  {
    id: 'fu-seed-eluria-2br',
    slug: 'eluria-2br-high-floor',
    title: '2 Bedroom high floor · Eluria',
    developmentName: 'Eluria',
    location: 'Legazpi Village, Makati City',
    unitLabel: '2 Bedroom',
    priceLabel: 'Price upon request',
    areaSqm: 98,
    bedrooms: '2',
    bathrooms: '2',
    floor: 'High',
    description:
      'Corner residence with Legazpi Village views. Verified details and viewing availability through the sales team.',
    highlights: ['Corner unit', 'Legazpi Village address', 'Pre-selling development'],
    heroImage: sectionImages.gallery.col3a,
    gallery: [sectionImages.gallery.col3a, sectionImages.gallery.col1a],
    published: true,
    displayOrder: 1,
    status: 'available',
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: 'fu-seed-una-1br',
    slug: 'una-1br-garden-view',
    title: '1 Bedroom garden view · Una Apartments',
    developmentName: 'Una Apartments',
    location: 'Sevina Park, Biñan, Laguna',
    unitLabel: '1 Bedroom',
    priceLabel: 'From ₱5.8M (verify with sales)',
    areaSqm: 52,
    bedrooms: '1',
    bathrooms: '1',
    floor: 'Mid',
    description:
      'Garden-facing unit at Sevina Park. Floor plan and payment terms confirmed with ARTHALAND sales.',
    highlights: ['Sevina Park', 'Garden orientation', 'Under construction'],
    heroImage: sectionImages.gallery.col1b,
    gallery: [sectionImages.gallery.col1b, sectionImages.gallery.col2b],
    published: true,
    displayOrder: 2,
    status: 'available',
    createdAt: ts,
    updatedAt: ts,
  },
]
