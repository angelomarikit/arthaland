import { siteConfig } from './site'

/** Text that appears on the public site today (source of truth for admin previews). */
export type PageSectionContent = {
  eyebrow?: string
  title?: string
  subtitle?: string
  body?: string
  imageUrl?: string
  posterImageUrl?: string
  videoDesktopUrl?: string
  videoMobileUrl?: string
  posterObjectPosition?: string
  videoObjectPosition?: string
  coverImageUrl?: string
  /** Home gallery / lifestyle tiles (stored in cms_page_sections.content JSON) */
  items?: unknown[]
}

export type LivePageSection = {
  sectionKey: string
  /** Customer-friendly name shown in admin */
  label: string
  sectionType: string
  displayOrder: number
  content: PageSectionContent
  /** Optional note (e.g. form-only blocks) */
  note?: string
}

const homeSections: LivePageSection[] = [
  {
    sectionKey: 'hero',
    label: 'Top hero (video & headline)',
    sectionType: 'hero',
    displayOrder: 1,
    content: {
      eyebrow: siteConfig.hero.eyebrow,
      title: siteConfig.hero.headline,
      subtitle: siteConfig.hero.subheading,
    },
  },
  {
    sectionKey: 'introduction',
    label: 'Introduction block',
    sectionType: 'richtext',
    displayOrder: 2,
    content: {
      eyebrow: 'Introduction',
      title: 'A New Perspective on Living.',
      body: 'ARTHALAND develops sustainably certified residential and commercial properties across the Philippines — where wellness, design, and long-term value meet verified architectural craft.',
    },
  },
  {
    sectionKey: 'featured-developments',
    label: 'Featured developments carousel',
    sectionType: 'list',
    displayOrder: 3,
    content: {
      eyebrow: 'Featured developments',
      title: 'Scroll the portfolio',
      body: 'Horizontal showcase of published developments (names come from Properties).',
    },
  },
  {
    sectionKey: 'sustainability',
    label: 'Sustainability highlights',
    sectionType: 'stats',
    displayOrder: 4,
    content: {
      eyebrow: 'Sustainability',
      title: 'Certified developments with measurable environmental performance',
      body: 'Figures below are corporate portfolio highlights (December 2025).',
    },
  },
  {
    sectionKey: 'lifestyle',
    label: 'Lifestyle editorial',
    sectionType: 'richtext',
    displayOrder: 5,
    content: {
      eyebrow: 'Lifestyle',
      title: 'Spaces shaped for calm, light, and longevity',
      body: 'Editorial glimpses from verified ARTHALAND project photography — interiors, facades, and amenity life.',
    },
  },
  {
    sectionKey: 'gallery',
    label: 'Architectural gallery',
    sectionType: 'gallery',
    displayOrder: 6,
    content: {
      eyebrow: 'Gallery',
      title: 'Architectural rhythm across developments',
    },
  },
  {
    sectionKey: 'services-preview',
    label: 'Services preview (dark band)',
    sectionType: 'richtext',
    displayOrder: 7,
    content: {
      eyebrow: 'Services',
      title: 'Sales-team guidance at every step',
      body: 'Property consultation, development information, viewing coordination, and buying guidance.',
    },
  },
  {
    sectionKey: 'faq',
    label: 'FAQ teaser',
    sectionType: 'richtext',
    displayOrder: 8,
    content: {
      eyebrow: 'questions',
      title: 'The things people ask us first',
      body: 'Short list of FAQs with link to full FAQ page.',
    },
  },
  {
    sectionKey: 'inquiry',
    label: 'Inquiry form section',
    sectionType: 'form',
    displayOrder: 9,
    content: {
      eyebrow: 'Inquiry',
      title: "Let's Find Your Next Home.",
      body: 'Connect with our team to explore properties, request information, or arrange a viewing. Supervised by Mr. Gary Lee · Apex Technology.',
    },
    note: 'Form fields are standard; edit the heading and text here when CMS is connected.',
  },
  {
    sectionKey: 'closing-cta',
    label: 'Bottom call-to-action',
    sectionType: 'cta',
    displayOrder: 10,
    content: {
      title: 'Begin your ARTHALAND inquiry',
      body: 'Request a viewing or send a message — our sales team will respond with verified development information.',
    },
  },
]

const aboutSections: LivePageSection[] = [
  {
    sectionKey: 'hero',
    label: 'Page hero',
    sectionType: 'hero',
    displayOrder: 1,
    content: {
      eyebrow: 'About ARTHALAND',
      title: 'Building Beyond Expectations.',
    },
  },
  {
    sectionKey: 'who-we-are',
    label: 'Who we are',
    sectionType: 'richtext',
    displayOrder: 2,
    content: {
      eyebrow: 'Who we are',
      title: 'Boutique developments with sustainability at the core',
      body: 'ARTHALAND Corporation is a publicly listed Philippine real estate developer focused on thoughtfully scaled residential and commercial projects.',
    },
  },
  {
    sectionKey: 'architectural-vision',
    label: 'Architectural vision',
    sectionType: 'richtext',
    displayOrder: 3,
    content: {
      eyebrow: 'Architectural vision',
      title: 'Design that respects light, landscape, and long-term living',
      body: 'From low-density addresses in Makati to wellness-led towers in Cebu and garden communities in Laguna, ARTHALAND pairs architectural rigor with environments meant to be lived in.',
    },
  },
  {
    sectionKey: 'sustainability-stats',
    label: 'Sustainability statistics',
    sectionType: 'stats',
    displayOrder: 4,
    content: {
      eyebrow: 'Sustainability',
      title: 'Measured progress across the portfolio',
      body: 'Figures reflect ARTHALAND corporate portfolio reporting (December 2025).',
    },
  },
  {
    sectionKey: 'approach-to-living',
    label: 'Approach to living',
    sectionType: 'richtext',
    displayOrder: 5,
    content: {
      eyebrow: 'Approach to living',
      title: 'Wellness, community, and responsible design',
      body: 'Potager gardens, efficient envelopes, and amenity programs that encourage movement and connection recur across ARTHALAND projects.',
    },
  },
  {
    sectionKey: 'sales-channel',
    label: 'Sales team channel',
    sectionType: 'richtext',
    displayOrder: 6,
    content: {
      eyebrow: 'Sales team channel',
      title: 'Supervised by Mr. Gary Lee',
      body: 'This website is the ARTHALAND property sales team channel — distinct from the corporate site.',
    },
  },
  {
    sectionKey: 'consultation-cta',
    label: 'Bottom consultation banner',
    sectionType: 'cta',
    displayOrder: 7,
    content: {
      eyebrow: 'Consultation',
      title: 'Explore properties or request a viewing',
      body: 'Our sales team can share verified development information, coordinate show suites where available, and guide your next steps.',
    },
  },
]

const servicesSections: LivePageSection[] = [
  {
    sectionKey: 'hero',
    label: 'Page hero',
    sectionType: 'hero',
    displayOrder: 1,
    content: {
      eyebrow: 'Services',
      title: 'Thoughtful Guidance, Every Step of the Way.',
      subtitle:
        'How the ARTHALAND sales team supports buyers exploring verified developments.',
    },
  },
  {
    sectionKey: 'property-consultation',
    label: 'Property consultation',
    sectionType: 'richtext',
    displayOrder: 2,
    content: {
      eyebrow: 'Consultation',
      title: 'Property consultation',
      body: 'Thoughtful guidance on ARTHALAND developments, sustainability features, and how each address may fit your lifestyle goals.',
    },
  },
  {
    sectionKey: 'development-discovery',
    label: 'Development discovery',
    sectionType: 'richtext',
    displayOrder: 3,
    content: {
      eyebrow: 'Discovery',
      title: 'Development discovery',
      body: 'Access brochures, certification summaries, and published timelines from official ARTHALAND sources.',
    },
  },
  {
    sectionKey: 'unit-selection',
    label: 'Unit selection assistance',
    sectionType: 'richtext',
    displayOrder: 4,
    content: {
      eyebrow: 'Selection',
      title: 'Unit selection assistance',
      body: 'Support comparing published unit types and configurations where available.',
    },
  },
  {
    sectionKey: 'viewing-coordination',
    label: 'Property viewing coordination',
    sectionType: 'richtext',
    displayOrder: 5,
    content: {
      eyebrow: 'Viewings',
      title: 'Property viewing coordination',
      body: 'Schedule show suites, model units, or site visits where offered.',
    },
  },
  {
    sectionKey: 'process',
    label: 'Four-step process',
    sectionType: 'list',
    displayOrder: 6,
    content: {
      title: 'How we work together',
      body: 'Share your interest → Review verified materials → Compare options → Coordinate next steps.',
    },
  },
  {
    sectionKey: 'consultation-cta',
    label: 'Bottom consultation banner',
    sectionType: 'cta',
    displayOrder: 7,
    content: {
      eyebrow: 'Consultation',
      title: 'Explore properties or request a viewing',
    },
  },
]

const contactSections: LivePageSection[] = [
  {
    sectionKey: 'hero',
    label: 'Page hero',
    sectionType: 'hero',
    displayOrder: 1,
    content: {
      eyebrow: 'Contact',
      title: 'Your Next Chapter Starts Here.',
      body: 'A private conversation with the ARTHALAND sales team — thoughtful, unhurried, and grounded in verified development information.',
    },
  },
  {
    sectionKey: 'consultation-panel',
    label: 'Left panel (consultation message)',
    sectionType: 'richtext',
    displayOrder: 2,
    content: {
      eyebrow: 'Consultation',
      title: 'Tell us what you are looking for — we will guide you through the published portfolio.',
    },
  },
  {
    sectionKey: 'office-contact',
    label: 'Office address & sales phone/email',
    sectionType: 'contact',
    displayOrder: 3,
    content: {
      title: 'Office',
      body: `${siteConfig.footer.office.lines.join(', ')} · ${siteConfig.contact.salesPhones.map((p) => p.display).join(' · ')} · ${siteConfig.contact.salesEmail}`,
    },
    note: 'Phone and email also appear in Settings; office lines match the footer.',
  },
  {
    sectionKey: 'inquiry-form',
    label: 'Inquiry form (right column)',
    sectionType: 'form',
    displayOrder: 4,
    content: {
      title: 'Send an inquiry',
      body: 'First name, last name, email, phone, optional development, message, viewing request.',
    },
    note: 'Submissions appear under Admin → Inquiries.',
  },
]

const teamSections: LivePageSection[] = [
  {
    sectionKey: 'hero',
    label: 'Page hero',
    sectionType: 'hero',
    displayOrder: 1,
    content: {
      eyebrow: 'Our team',
      title: 'People Behind Your Property Journey.',
    },
  },
  {
    sectionKey: 'sales-channel',
    label: 'Sales channel intro',
    sectionType: 'richtext',
    displayOrder: 2,
    content: {
      eyebrow: 'Sales channel',
      title: 'A dedicated team for buyers exploring ARTHALAND residences',
      body: 'This site represents the property sales team supervised by Mr. Gary Lee — separate from ARTHALAND corporate communications.',
    },
  },
  {
    sectionKey: 'leadership',
    label: 'Mr. Gary Lee profile',
    sectionType: 'richtext',
    displayOrder: 3,
    content: {
      eyebrow: 'Leadership',
      title: 'Mr. Gary Lee',
      subtitle: 'Sales Team Supervisor',
      body: 'An approved portrait and extended biography will be published when supplied by the team.',
    },
  },
  {
    sectionKey: 'our-approach',
    label: 'How we work with buyers',
    sectionType: 'list',
    displayOrder: 4,
    content: {
      eyebrow: 'Our approach',
      title: 'How we work with buyers',
      body: 'Property guidance · Responsive communication · Development knowledge · Viewing coordination',
    },
  },
  {
    sectionKey: 'consultation-cta',
    label: 'Bottom consultation banner',
    sectionType: 'cta',
    displayOrder: 5,
    content: {
      title: 'Connect with the sales team',
      body: 'Share your development interest or request a viewing through our inquiry form.',
    },
  },
]

const featuredUnitsSections: LivePageSection[] = [
  {
    sectionKey: 'hero',
    label: 'Page hero',
    sectionType: 'hero',
    displayOrder: 1,
    content: {
      eyebrow: 'Marketplace',
      title: 'Featured units for sale',
      body: 'Curated resale and developer inventory posted by the ARTHALAND sales team.',
    },
  },
  {
    sectionKey: 'listings-grid',
    label: 'Listing cards',
    sectionType: 'list',
    displayOrder: 2,
    content: {
      title: 'Marketplace grid',
      body: 'Each card is a featured unit managed under Admin → Featured units.',
    },
    note: 'Individual listings are not edited on Pages — use Featured units in admin.',
  },
]

const registry: Record<string, LivePageSection[]> = {
  home: homeSections,
  about: aboutSections,
  services: servicesSections,
  contact: contactSections,
  team: teamSections,
  'featured-units': featuredUnitsSections,
}

export function getLivePageSections(pageSlug: string): LivePageSection[] {
  return registry[pageSlug] ?? []
}

export function formatSectionPreview(content: PageSectionContent, maxLen = 160): string {
  const parts = [content.eyebrow, content.title, content.subtitle, content.body].filter(Boolean)
  const text = parts.join(' · ')
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen).trim()}…`
}

export function pageLiveSummary(pageSlug: string): string {
  const hero = getLivePageSections(pageSlug).find((s) => s.sectionKey === 'hero')
  if (!hero) return 'Marketing page'
  return hero.content.title ?? hero.label
}
