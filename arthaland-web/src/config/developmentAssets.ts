/**
 * Central registry for development imagery.
 * `illustrative` entries must not be labeled as verified property photography.
 */
export const developmentAssets = {
  verified: {
    eluriaHero: '/assets/optimized/eluria-hero.webp',
    unaHero: '/assets/optimized/una-apartments-hero.webp',
    unaExterior: '/assets/optimized/una-exterior.webp',
    lucimaFacade: '/assets/optimized/lucima-facade.webp',
    lucimaExterior: '/assets/optimized/lucima-exterior.webp',
    lucimaInterior: '/assets/optimized/lucima-interior.webp',
    lucimaAerial: '/assets/optimized/lucima-aerial.webp',
    sondrisHero: '/assets/properties/sondris/exterior-hero.webp',
    livCampaign: '/assets/properties/liv/exterior-hero.png',
  },
  /** Licensed-style editorial placeholders (ARTHALAND portfolio photography). */
  illustrative: {
    commercialFacade: '/assets/optimized/lucima-facade.webp',
    commercialAerial: '/assets/optimized/lucima-aerial.webp',
    residentialInterior: '/assets/optimized/lucima-interior.webp',
    landscape: '/assets/optimized/una-exterior.webp',
    tower: '/assets/optimized/lucima-exterior.webp',
  },
  propertiesHero: '/assets/optimized/lucima-aerial.webp',
  propertiesIntro: '/assets/optimized/lucima-facade.webp',
} as const
