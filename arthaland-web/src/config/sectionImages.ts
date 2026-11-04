/**
 * Production imagery — optimized WebP under /assets/optimized/.
 * Originals archived under asset-archive/ (not served).
 */
export const sectionImages = {
  heroPoster: '/assets/hero/arthaland-hero-poster.webp',
  editorialIntro: '/assets/optimized/una-exterior.webp',
  sustainability: '/assets/optimized/lucima-exterior.webp',
  lifestyleInterior: '/assets/optimized/lucima-interior.webp',
  lifestyleExterior: '/assets/optimized/lucima-facade.webp',
  lifestyleWellness: '/assets/properties/sondris/exterior-hero.webp',
  gallery: {
    col1a: '/assets/optimized/lucima-facade.webp',
    col1b: '/assets/optimized/una-exterior.webp',
    col2a: '/assets/properties/sondris/exterior-hero.webp',
    col2b: '/assets/optimized/lucima-aerial.webp',
    col3a: '/assets/optimized/lucima-interior.webp',
    col3b: '/assets/optimized/lucima-exterior.webp',
  },
  services: [
    '/assets/optimized/una-exterior.webp',
    '/assets/optimized/lucima-exterior.webp',
    '/assets/properties/sondris/exterior-hero.webp',
    '/assets/optimized/lucima-aerial.webp',
  ],
  aboutHero: '/assets/optimized/lucima-aerial.webp',
  aboutEditorial: '/assets/optimized/lucima-facade.webp',
  aboutInterior: '/assets/optimized/lucima-interior.webp',
  contactBg: '/assets/optimized/lucima-facade.webp',
  closingCta: '/assets/optimized/lucima-aerial.webp',
  inquirySide: '/assets/optimized/una-apartments-hero.webp',
} as const

export const socialLinks = {
  facebook: 'https://www.facebook.com/arthaland',
} as const
