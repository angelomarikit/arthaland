export const siteConfig = {
  brand: {
    name: 'ARTHALAND',
    logoMarkSrc: '/assets/brand/arthaland-mark.png',
    logoLockupSrc: '/assets/brand/arthaland-logo-lockup.png',
  },
  seo: {
    title: 'ARTHALAND — Building Sustainable Legacies',
    description:
      'Exceptional residential and commercial developments across the Philippines. Explore the ARTHALAND portfolio.',
    ogImage: '/assets/brand/arthaland-og.jpg',
    ogImageAlt:
      'ARTHALAND — Exceptional spaces for a better tomorrow. Residential, commercial, and sustainable developments.',
  },
  social: {
    facebook: 'https://www.facebook.com/arthaland',
  },
  /** Property sales team — shown on Contact, footer, widget, FAQ */
  contact: {
    salesEmail: 'gelee@partners.arthaland.com',
    salesPhones: [
      { display: '0927 372 2697', tel: '+639273722697' },
      { display: '0918 902 8888', tel: '+639189028888' },
    ],
  },
  nav: {
    primary: [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Featured Units', href: '/featured-units' },
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
    ],
    pagesMenu: [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Featured Units', href: '/featured-units' },
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy', href: '/privacy' },
    ],
    cta: { label: 'Get in Touch', href: '/contact' },
  },
  hero: {
    eyebrow: 'Premium residential advisory',
    headline: 'Discover Exceptional Places to Live',
    subheading:
      'Explore thoughtfully designed spaces that bring together comfort, wellness, and modern living.',
    primaryCta: { label: 'Explore Properties', href: '/properties' },
    secondaryCta: { label: 'Get in Touch', href: '/contact' },
  },
  footer: {
    mainPages: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Properties', href: '/properties' },
      { label: 'Featured Units', href: '/featured-units' },
      { label: 'Services', href: '/services' },
      { label: 'Our Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy', href: '/privacy' },
    ],
    services: [
      { label: 'Property consultation', href: '/services' },
      { label: 'Development information', href: '/services' },
      { label: 'Viewing coordination', href: '/services' },
      { label: 'Buying guidance', href: '/services' },
    ],
    office: {
      lines: [
        'Arthaland Century Pacific Tower',
        '5th Avenue corner 30th Street, Taguig City, 1634',
      ],
      email: 'gelee@partners.arthaland.com',
      phone: '0927 372 2697',
    },
    copyright: '© 2026 ARTHALAND Corporation. Sales team site by Apex Technology.',
  },
} as const
