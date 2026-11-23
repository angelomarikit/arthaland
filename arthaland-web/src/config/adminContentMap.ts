import { getLivePageSections } from './pageContentRegistry'

export type AdminSectionLink = {
  id: string
  label: string
  publicLabel: string
  editHref: string
  previewHref?: string
  help: string
}

function sectionLink(
  pageSlug: string,
  sectionKey: string,
  overrides?: Partial<AdminSectionLink>,
): AdminSectionLink {
  const live = getLivePageSections(pageSlug).find((s) => s.sectionKey === sectionKey)
  return {
    id: sectionKey,
    label: live?.label ?? sectionKey,
    publicLabel: live?.label ?? sectionKey,
    editHref: `/admin/pages/${pageSlug}/sections/${sectionKey}`,
    previewHref: pageSlug === 'home' ? (sectionKey === 'hero' ? '/' : `/#${sectionKey}`) : `/${pageSlug}`,
    help: live?.note ?? 'Edit headings, body text, and optional images. Save to publish.',
    ...overrides,
  }
}

/** Same order as HomePage.tsx */
export function homePageEditSections(): AdminSectionLink[] {
  return [
    {
      id: 'hero',
      label: 'Top hero',
      publicLabel: 'Hero video & headline',
      editHref: '/admin/homepage',
      previewHref: '/',
      help: 'Poster, videos, framing, and hero copy. Save homepage management after uploads.',
    },
    {
      id: 'discovery-bar',
      label: 'Property filters',
      publicLabel: 'Quick filters under hero',
      editHref: '/admin/properties',
      previewHref: '/',
      help: 'Lists published developments. Toggle Featured on each property Overview.',
    },
    sectionLink('home', 'introduction', {
      editHref: '/admin/pages/home/sections/introduction',
      previewHref: '/#introduction',
    }),
    {
      id: 'cert-marquee',
      label: 'Certification strip',
      publicLabel: 'Scrolling certification logos',
      editHref: '/admin/pages/certifications',
      previewHref: '/',
      help: 'Marketing certifications page content; logos are brand assets, not property gallery photos.',
    },
    sectionLink('home', 'featured-developments', { previewHref: '/#featured' }),
    sectionLink('home', 'sustainability', { previewHref: '/#sustainability' }),
    {
      id: 'lifestyle',
      label: 'Lifestyle editorial',
      publicLabel: 'Lifestyle photo grid',
      editHref: '/admin/lifestyle',
      previewHref: '/#lifestyle',
      help: 'Upload images, drag to reorder, Save lifestyle section.',
    },
    {
      id: 'gallery',
      label: 'Home gallery',
      publicLabel: 'Architectural gallery (3 columns)',
      editHref: '/admin/gallery',
      previewHref: '/#gallery',
      help: 'Property marketing tiles — drag to reorder, set links to property pages, Save gallery.',
    },
    sectionLink('home', 'services-preview'),
    sectionLink('home', 'faq', { previewHref: '/#faq' }),
    sectionLink('home', 'inquiry', { previewHref: '/#inquiry' }),
    sectionLink('home', 'closing-cta'),
  ]
}

export function marketingPageEditSections(pageSlug: string): AdminSectionLink[] {
  return getLivePageSections(pageSlug).map((s) => ({
    id: s.sectionKey,
    label: s.label,
    publicLabel: s.label,
    editHref: `/admin/pages/${pageSlug}/sections/${s.sectionKey}`,
    previewHref: pageSlug === 'home' ? '/' : `/${pageSlug}`,
    help: s.note ?? 'Edit headings, body text, and optional images. Save to publish.',
  }))
}

export function propertyPageEditSections(slug: string): AdminSectionLink[] {
  return [
    {
      id: 'hero',
      label: 'Hero & publication',
      publicLabel: 'Top hero image / video',
      editHref: `/admin/properties/${slug}`,
      previewHref: `/properties/${slug}`,
      help: 'Upload hero, set Published/Coming soon, and sync card images.',
    },
    {
      id: 'specs',
      label: 'Specifications',
      publicLabel: 'Overview stats (stories, units, completion)',
      editHref: `/admin/properties/${slug}/specifications`,
      help: 'Building facts and overview image (not the photo gallery).',
    },
    {
      id: 'certs',
      label: 'Certifications',
      publicLabel: 'Sustainability badges (LEED, WELL, …)',
      editHref: `/admin/properties/${slug}/certifications`,
      help: 'Logos appear in Certifications only — not in the property gallery.',
    },
    {
      id: 'location',
      label: 'Location & map',
      publicLabel: 'Map embed',
      editHref: `/admin/properties/${slug}/location`,
      previewHref: `/properties/${slug}#location`,
      help: 'Paste Google Maps link; optional coordinates under Advanced.',
    },
    {
      id: 'nearby',
      label: 'Nearby places',
      publicLabel: 'Neighborhood list',
      editHref: `/admin/properties/${slug}/nearby`,
      help: 'Schools, malls, transit — publish each row.',
    },
    {
      id: 'amenities',
      label: 'Amenities',
      publicLabel: 'Amenities & sustainability lists',
      editHref: `/admin/properties/${slug}/amenities`,
      help: 'Drag to reorder lines before Save.',
    },
    {
      id: 'gallery',
      label: 'Photo gallery',
      publicLabel: 'Facade, amenities, interiors (bottom gallery)',
      editHref: `/admin/properties/${slug}/media`,
      previewHref: `/properties/${slug}`,
      help: 'Upload here. Drag to reorder. Toggle Publish. Not for cert logos or floor plans.',
    },
    {
      id: 'collections',
      label: 'Gallery collections',
      publicLabel: 'Grouped gallery tabs',
      editHref: `/admin/properties/${slug}/gallery`,
      help: 'Optional tabs; collection must be published and images assigned.',
    },
    {
      id: 'units',
      label: 'Unit layouts',
      publicLabel: 'Floor plans & unit types',
      editHref: `/admin/properties/${slug}/units`,
      previewHref: `/properties/${slug}#layouts`,
      help: 'Unit must be Published. Upload floor plan under each unit.',
    },
    {
      id: 'video',
      label: 'Video',
      publicLabel: 'Showcase video block',
      editHref: `/admin/properties/${slug}/video`,
      help: 'Upload or external YouTube/Vimeo URL.',
    },
    {
      id: 'inquiry',
      label: 'Inquiry CTA',
      publicLabel: 'Inquiry form headings',
      editHref: `/admin/properties/${slug}/sections/inquiry-cta`,
      help: 'Form fields are fixed; edit titles and helper copy.',
    },
    {
      id: 'seo',
      label: 'SEO',
      publicLabel: 'Search / social preview',
      editHref: `/admin/properties/${slug}/seo`,
      help: 'Title, description, share image.',
    },
  ]
}