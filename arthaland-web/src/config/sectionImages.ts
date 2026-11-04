/**
 * Unique imagery per homepage section — no repeated Eluria brochure asset.
 * Paths point to verified building photography / renders in public/assets.
 */
export const sectionImages = {
  heroPoster: '/assets/hero/arthaland-hero-poster.webp',
  editorialIntro: '/assets/hero/source/shot2-una-exterior.jpeg',
  sustainability: '/assets/properties/lucima/exterior-hero.jpg',
  lifestyleInterior: '/assets/hero/source/shot4-lucima-interior.jpg',
  lifestyleExterior: '/assets/hero/source/shot3-lucima-facade.jpg',
  lifestyleWellness: '/assets/properties/sondris/exterior-hero.webp',
  gallery: {
    col1a: '/assets/hero/source/shot3-lucima-facade.jpg',
    col1b: '/assets/properties/una-apartments/exterior-hero.jpeg',
    col2a: '/assets/properties/sondris/exterior-hero.webp',
    col2b: '/assets/hero/source/shot5-lucima-aerial.jpg',
    col3a: '/assets/hero/source/shot4-lucima-interior.jpg',
    col3b: '/assets/properties/lucima/exterior-hero.jpg',
  },
  services: [
    '/assets/hero/source/shot2-una-exterior.jpeg',
    '/assets/properties/lucima/exterior-hero.jpg',
    '/assets/properties/sondris/exterior-hero.webp',
    '/assets/hero/source/shot5-lucima-aerial.jpg',
  ],
  aboutHero: '/assets/hero/source/shot5-lucima-aerial.jpg',
  aboutEditorial: '/assets/hero/source/shot3-lucima-facade.jpg',
  aboutInterior: '/assets/hero/source/shot4-lucima-interior.jpg',
  contactBg: '/assets/hero/source/shot3-lucima-facade.jpg',
  closingCta: '/assets/hero/source/shot5-lucima-aerial.jpg',
  inquirySide: '/assets/properties/una-apartments/exterior-hero.jpeg',
} as const

export const socialLinks = {
  facebook: 'https://www.facebook.com/arthaland',
} as const
