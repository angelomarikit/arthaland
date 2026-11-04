export type DevelopmentStatus =
  | 'Pre-Selling'
  | 'Under Construction'
  | 'Completed'
  | 'Inquire for Availability'

export type PropertyType =
  | 'Residential Condominium'
  | 'Mixed-Use'
  | 'Villa'
  | 'Apartment'

export type Development = {
  slug: string
  name: string
  location: string
  region: string
  type: PropertyType
  status: DevelopmentStatus
  /** Verified pricing only — otherwise display label */
  priceLabel: string
  bedroomsRange?: string
  areaRange?: string
  featured: boolean
  published: boolean
  heroImage: string
  gallery: string[]
  summary: string
  overview: string
  amenities: string[]
  sustainability: string[]
  officialUrl: string
  sourceNote?: string
}

/** Verified from arthaland.com property pages (Nov 2026). */
export const developments: Development[] = [
  {
    slug: 'eluria',
    name: 'Eluria',
    location: 'Legazpi Village, Makati City',
    region: 'Metro Manila',
    type: 'Residential Condominium',
    status: 'Pre-Selling',
    priceLabel: 'Price Upon Request',
    bedroomsRange: 'Limited-edition residences (37 units)',
    featured: true,
    published: true,
    heroImage: '/assets/properties/eluria/exterior-hero.png',
    gallery: ['/assets/properties/eluria/exterior-hero.png'],
    summary:
      'A low-density, multi-certified residential address in Legazpi Village reimagining exclusivity and sustainable living.',
    overview:
      'Eluria by ARTHALAND and ARCH Capital will reimagine what it means to be one of the most exclusive residential addresses in Legazpi Village, Makati, pushing the boundaries of sustainable living with 37 purposely built limited-edition residences.',
    amenities: [
      'White-glove butler services',
      'Internationally trained Hospitality Directors',
      'Show suite and signature experiences',
    ],
    sustainability: [
      '20% water savings target',
      '40% energy savings target',
      '100% greenhouse gas emissions avoided target by 2030',
      'LEED precertified Gold (among other registrations)',
    ],
    officialUrl: 'https://arthaland.com/properties/eluria',
    sourceNote:
      'Hero image is official hospitality creative; authorized Eluria exterior photography pending.',
  },
  {
    slug: 'una-apartments',
    name: 'Una Apartments',
    location: 'Sevina Park, Biñan, Laguna',
    region: 'Laguna',
    type: 'Apartment',
    status: 'Under Construction',
    priceLabel: 'From ₱5.8M (per official site)',
    bedroomsRange: 'Studio & 1 Bedroom',
    areaRange: '28–37 sqm',
    featured: true,
    published: true,
    heroImage: '/assets/properties/una-apartments/exterior-hero.jpeg',
    gallery: ['/assets/properties/una-apartments/exterior-hero.jpeg'],
    summary:
      'Three towers of studio and one-bedroom homes within Sevina Park with sustainability and wellness features.',
    overview:
      'Una Apartments is ARTHALAND\'s sustainable residential condominium in Biñan, Laguna, designed by Leandro V. Locsin Partners with features intended to lower utility bills and improve indoor air quality.',
    amenities: [
      'Swimming pools',
      'Fitness gym',
      'Function room',
      'Potager Garden',
      'Pet park',
    ],
    sustainability: [
      '20% water savings target',
      '20% energy savings target',
      '100% greenhouse gas emissions avoided target by 2030',
    ],
    officialUrl: 'https://arthaland.com/properties/una-apartments',
  },
  {
    slug: 'lucima',
    name: 'Lucima',
    location: 'Cebu Business Park, Cebu City',
    region: 'Cebu',
    type: 'Residential Condominium',
    status: 'Completed',
    priceLabel: 'Inquire for Availability',
    bedroomsRange: '1–4 Bedroom',
    areaRange: '38–318 sqm',
    featured: true,
    published: true,
    heroImage: '/assets/hero/source/shot3-lucima-facade.jpg',
    gallery: [
      '/assets/hero/source/shot3-lucima-facade.jpg',
      '/assets/properties/lucima/exterior-hero.jpg',
      '/assets/hero/source/shot5-lucima-aerial.jpg',
    ],
    summary:
      'A 37-story wellness-led residential tower envisioned as a quadruple-certified sustainable high-rise in Cebu Business Park.',
    overview:
      'Lucima interweaves wellness and sustainability across 265 residences with 2.9m floor-to-ceiling heights and views of the ocean, mountains, or city.',
    amenities: ['Potager Garden', 'Bicycle facilities', '24/7 security robotics'],
    sustainability: [
      'LEED Gold precertification',
      'Targeting EDGE, WELL, and BERDE',
      'Efficient building envelope',
      'Rainwater management',
    ],
    officialUrl: 'https://arthaland.com/properties/lucima',
  },
  {
    slug: 'sevina-park',
    name: 'Sevina Park',
    location: 'Biñan, Laguna',
    region: 'Laguna',
    type: 'Mixed-Use',
    status: 'Inquire for Availability',
    priceLabel: 'Price Upon Request',
    featured: false,
    published: false,
    heroImage: '/assets/properties/una-apartments/exterior-hero.jpeg',
    gallery: ['/assets/properties/una-apartments/exterior-hero.jpeg'],
    sourceNote:
      'Unpublished until dedicated Sevina Park photography is authorized (was reusing Una construction image).',
    summary:
      'An 8.1-hectare masterplanned community with 60% green and open spaces, including villas and Una Apartments.',
    overview:
      'Sevina Park is masterplanned by Sasaki Associates and recognized with LEED Platinum certifications for Neighborhood Development and Homes.',
    amenities: [
      'Sevina Park Villas',
      'Una Apartments towers',
      'Project BEAM community clinic',
      'Shared courtyard gardens',
    ],
    sustainability: [
      '60% green open spaces',
      'Potager gardens',
      'Low-flow fixtures',
      'Solar energy in select villa units',
    ],
    officialUrl: 'https://arthaland.com/properties/sevina-park',
  },
  {
    slug: 'liv',
    name: 'Liv',
    location: 'Katipunan, Quezon City',
    region: 'Metro Manila',
    type: 'Residential Condominium',
    status: 'Pre-Selling',
    priceLabel: 'Inquire for Availability',
    bedroomsRange: 'Studio – 2 Bedroom',
    featured: false,
    published: false,
    heroImage: '/assets/properties/liv/exterior-hero.png',
    gallery: ['/assets/properties/liv/exterior-hero.png'],
    sourceNote:
      'Unpublished — current asset is a campaign graphic, not building photography.',
    summary:
      'A vertical neighborhood in Katipunan with adaptable layouts and quadruple sustainability certification targets.',
    overview:
      'Liv reimagines home in Katipunan with biophilic design, wellness amenities, and direct bridgeway access to Ateneo de Manila University.',
    amenities: [
      'Visionary Hub',
      'Fitness center & pools',
      'Potager Garden',
      'Co-working spaces',
    ],
    sustainability: [
      'Targeting LEED, WELL, EDGE, and BERDE',
      'Up to 20% energy and water savings',
    ],
    officialUrl: 'https://arthaland.com/properties/liv',
  },
  {
    slug: 'sondris',
    name: 'Sondris',
    location: 'Legazpi Village, Makati City',
    region: 'Metro Manila',
    type: 'Residential Condominium',
    status: 'Pre-Selling',
    priceLabel: 'Investment range published on official site',
    bedroomsRange: '1–3 Bedroom + Garden units',
    featured: false,
    published: true,
    heroImage: '/assets/properties/sondris/exterior-hero.webp',
    gallery: [
      '/assets/properties/sondris/exterior-hero.webp',
      '/assets/properties/sondris/exterior-hero.png',
    ],
    summary:
      'A 37-story green residential tower along Arnaiz Avenue developed by ARTHALAND and Mitsui Fudosan (Asia).',
    overview:
      'Sondris features 252 residences designed by AEDAS with Japanese-inspired principles of balance, natural light, and long-term value.',
    amenities: [
      '25-meter heated saltwater pool',
      'Potager Garden',
      'Sky lounge & roof deck',
      'Podium parking with EV provisions',
    ],
    sustainability: [
      'Pursuing LEED Gold, WELL, EDGE, and BERDE',
      'Rainwater management',
      'Materials Recovery Facility',
    ],
    officialUrl: 'https://arthaland.com/properties/sondris',
    sourceNote:
      'Unit investment ranges are published on arthaland.com; confirm availability with the sales team.',
  },
]

export function getDevelopment(slug: string): Development | undefined {
  return developments.find((d) => d.slug === slug && d.published)
}

export function getPublishedDevelopments(): Development[] {
  return developments.filter((d) => d.published)
}
