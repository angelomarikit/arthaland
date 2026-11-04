/** Maps public routes to Admin → Pages slugs. */
const ROUTE_TO_PAGE_SLUG: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/contact': 'contact',
  '/team': 'team',
  '/featured-units': 'featured-units',
}

export function pathToPageSlug(pathname: string): string | null {
  const normalized = pathname.split('?')[0] ?? '/'
  if (normalized === '/' || normalized === '') return 'home'
  const base = normalized.replace(/\/$/, '') || '/'
  return ROUTE_TO_PAGE_SLUG[base] ?? null
}
