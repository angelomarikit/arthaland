import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  FileText,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Map,
  Settings,
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
      { label: 'Where images appear', href: '/admin/site-images', icon: Map },
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    id: 'properties',
    label: 'Properties',
    items: [
      { label: 'All Developments', href: '/admin/properties', icon: Building2 },
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
  { label: 'Units', href: `/admin/properties/${slug}/units` },
  { label: 'Media & Galleries', href: `/admin/properties/${slug}/media` },
  { label: 'Amenities', href: `/admin/properties/${slug}/amenities` },
  ...propertySectionLinks(slug),
]
