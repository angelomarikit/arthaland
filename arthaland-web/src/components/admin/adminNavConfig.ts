import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  FileText,
  Image,
  LayoutDashboard,
  Leaf,
  Mail,
  Map,
  Settings,
  Store,
  Users,
} from 'lucide-react'

export type AdminNavItem = {
  label: string
  href: string
  icon?: LucideIcon
}

export type AdminNavGroup = {
  id: string
  label: string
  items: AdminNavItem[]
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    id: 'website',
    label: 'Website',
    items: [
      { label: 'Homepage management', href: '/admin/homepage', icon: LayoutDashboard },
      { label: 'Gallery management', href: '/admin/gallery', icon: Image },
      { label: 'Lifestyle management', href: '/admin/lifestyle', icon: Leaf },
      { label: 'Where images appear', href: '/admin/site-images', icon: Map },
      { label: 'Pages', href: '/admin/pages', icon: FileText },
    ],
  },
  {
    id: 'properties',
    label: 'Properties',
    items: [
      { label: 'All Developments', href: '/admin/properties', icon: Building2 },
      { label: 'Featured units', href: '/admin/featured-units', icon: Store },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    items: [{ label: 'Inquiries', href: '/admin/inquiries', icon: Mail }],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { label: 'Team', href: '/admin/team', icon: Users },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export const propertySectionLinks = (slug: string) => [
  { key: 'hero', label: 'Hero' },
  { key: 'overview', label: 'Overview' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'residences', label: 'Residences' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'amenities', label: 'Amenities' },
  { key: 'sustainability', label: 'Sustainability' },
  { key: 'location', label: 'Location' },
  { key: 'video', label: 'Video' },
  { key: 'inquiry-cta', label: 'Inquiry CTA' },
].map((s) => ({
  ...s,
  href: `/admin/properties/${slug}/sections/${s.key}`,
}))

export const propertySubLinks = (slug: string) => [
  { label: 'Overview', href: `/admin/properties/${slug}` },
  { label: 'Specifications', href: `/admin/properties/${slug}/specifications` },
  { label: 'Certifications', href: `/admin/properties/${slug}/certifications` },
  { label: 'Location', href: `/admin/properties/${slug}/location` },
  { label: 'Nearby', href: `/admin/properties/${slug}/nearby` },
  { label: 'Units', href: `/admin/properties/${slug}/units` },
  { label: 'Gallery collections', href: `/admin/properties/${slug}/gallery` },
  { label: 'Media library', href: `/admin/properties/${slug}/media` },
  { label: 'Amenities', href: `/admin/properties/${slug}/amenities` },
  { label: 'Video', href: `/admin/properties/${slug}/video` },
  { label: 'SEO', href: `/admin/properties/${slug}/seo` },
]
