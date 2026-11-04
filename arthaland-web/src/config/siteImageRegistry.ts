import { developmentSeed } from '../data/seed/developments.seed'
import { sectionImages } from './sectionImages'

export type SiteImageStatus = 'verified' | 'illustrative' | 'editorial'

export type SiteImageEntry = {
  id: string
  imageUrl: string
  /** Short label for admins */
  title: string
  /** Plain language — where visitors see this */
  whereOnSite: string
  page: string
  status: SiteImageStatus
  statusNote?: string
  /** Where to replace this image in CMS */
  manageLabel: string
  manageHref: string
  viewOnSiteHref?: string
}

function editorial(
  id: string,
  imageUrl: string,
  title: string,
  whereOnSite: string,
  page: string,
  manageLabel: string,
  manageHref: string,
  viewOnSiteHref?: string,
): SiteImageEntry {
  return {
    id,
    imageUrl,
    title,
    whereOnSite,
    page,
    status: 'editorial',
    manageLabel,
    manageHref,
    viewOnSiteHref,
  }
}

const homeAndPages: SiteImageEntry[] = [
  editorial(
    'home-hero-video-poster',
    sectionImages.heroPoster,
    'Homepage hero (video poster)',
    'Full-screen background on the homepage while the hero video loads',
    'Home',
    'Home hero is the background video in code — replace poster in Media Library when CMS video is wired',
    '/admin/site-images',
    '/',
  ),
  editorial(
    'home-sustainability',
    sectionImages.sustainability,
    'Sustainability section image',
    'Homepage — “Sustainable by design” editorial block',
    'Home',
    'Edit Home page sections (when seeded in CMS)',
    '/admin/pages/home',
    '/',
  ),
  editorial(
    'home-lifestyle-interior',
    sectionImages.lifestyleInterior,
    'Lifestyle — interior',
    'Homepage lifestyle gallery, first panel',
    'Home',
    'Edit Home page sections',
    '/admin/pages/home',
    '/',
  ),
  editorial(
    'home-lifestyle-exterior',
    sectionImages.lifestyleExterior,
    'Lifestyle — exterior',
    'Homepage lifestyle gallery, second panel',
    'Home',
    'Edit Home page sections',
    '/admin/pages/home',
    '/',
  ),
  editorial(
    'home-lifestyle-wellness',
    sectionImages.lifestyleWellness,
    'Lifestyle — wellness',
    'Homepage lifestyle gallery, third panel (Sondris photography)',
    'Home',
    'Edit Home page sections',
    '/admin/pages/home',
    '/',
  ),
  editorial(
    'home-gallery-1',
    sectionImages.gallery.col1a,
    'Architectural gallery — Lucima facade',
    'Homepage photo grid, column 1 (top)',
    'Home',
    'Edit Home page sections',
    '/admin/pages/home',
    '/',
  ),
  editorial(
    'home-closing-cta',
    sectionImages.closingCta,
    'Closing call-to-action',
    'Bottom of homepage and several pages — “Get in touch” wide image',
    'Home',
    'Edit Home page sections',
    '/admin/pages/home',
    '/',
  ),
  editorial(
    'about-hero',
    sectionImages.aboutHero,
    'About page hero',
    'Top banner on About Us',
    'About',
    'About page → hero section',
    '/admin/pages/about',
    '/about',
  ),
  editorial(
    'about-editorial',
    sectionImages.aboutEditorial,
    'About editorial image',
    'About Us — story section beside copy',
    'About',
    'About page sections',
    '/admin/pages/about',
    '/about',
  ),
  editorial(
    'properties-hero',
    sectionImages.propertiesHero,
    'Properties page hero',
    'Top banner on the Properties portfolio page',
    'Properties',
    'Properties page sections (or upload in Media Library)',
    '/admin/pages/home',
    '/properties',
  ),
  editorial(
    'properties-intro',
    sectionImages.propertiesIntro,
    'Properties intro image',
    'Properties page — “Ten developments” editorial row',
    'Properties',
    'Properties page sections',
    '/admin/pages/home',
    '/properties',
  ),
  editorial(
    'services-hero',
    sectionImages.servicesHero,
    'Services page hero',
    'Top banner on Services',
    'Services',
    'Services page sections',
    '/admin/pages/services',
    '/services',
  ),
  editorial(
    'contact-bg',
    sectionImages.contactBg,
    'Contact page background',
    'Contact page — soft background behind the form area',
    'Contact',
    'Contact page sections',
    '/admin/pages/contact',
    '/contact',
  ),
  editorial(
    'contact-panel',
    sectionImages.contactPanel,
    'Contact overlapping panel',
    'Contact page — decorative panel image',
    'Contact',
    'Contact page sections',
    '/admin/pages/contact',
    '/contact',
  ),
  editorial(
    'team-hero',
    sectionImages.teamHero,
    'Team page hero',
    'Top banner on Our Team',
    'Team',
    'Team page sections',
    '/admin/pages/team',
    '/team',
  ),
  editorial(
    'inquiry-widget-side',
    sectionImages.inquirySide,
    'Help / inquiry widget',
    'Small image beside the floating help widget (if shown)',
    'Site-wide',
    'Media Library',
    '/admin/site-images',
  ),
]

const propertyImages: SiteImageEntry[] = developmentSeed.flatMap((d) => {
  const status: SiteImageStatus = d.usesIllustrativeImagery
    ? 'illustrative'
    : d.sourceNote?.includes('pending') || d.sourceNote?.includes('interim')
      ? 'illustrative'
      : 'verified'
  return [
    {
      id: `${d.slug}-hero`,
      imageUrl: d.heroImage,
      title: `${d.name} — hero`,
      whereOnSite: `Property page top banner and large header for ${d.name}`,
      page: 'Property detail',
      status,
      statusNote: d.sourceNote,
      manageLabel: `Manage ${d.name}`,
      manageHref: `/admin/properties/${d.slug}`,
      viewOnSiteHref: `/properties/${d.slug}`,
    },
    {
      id: `${d.slug}-card`,
      imageUrl: d.cardImage,
      title: `${d.name} — listing card`,
      whereOnSite: `Properties grid card and navigation previews for ${d.name}`,
      page: 'Properties',
      status,
      statusNote: d.usesIllustrativeImagery
        ? 'Not verified photography of this development'
        : undefined,
      manageLabel: `Gallery & cover for ${d.name}`,
      manageHref: `/admin/properties/${d.slug}/media`,
      viewOnSiteHref: '/properties',
    },
  ]
})

export const siteImageRegistry: SiteImageEntry[] = [...homeAndPages, ...propertyImages]

export const siteImagePages = [
  'All',
  ...Array.from(new Set(siteImageRegistry.map((e) => e.page))).sort(),
]

export function filterSiteImages(page: string, query: string): SiteImageEntry[] {
  const q = query.trim().toLowerCase()
  return siteImageRegistry.filter((e) => {
    if (page !== 'All' && e.page !== page) return false
    if (!q) return true
    return (
      e.title.toLowerCase().includes(q) ||
      e.whereOnSite.toLowerCase().includes(q) ||
      e.page.toLowerCase().includes(q)
    )
  })
}
