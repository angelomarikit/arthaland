/** Hidden from nav, portfolio, and inquiry forms — inventory sold out on this channel. */
export const SOLD_OUT_DEVELOPMENT_SLUGS = [
  'lucima',
  'cebu-exchange',
  'arya-residences',
] as const

export function isSoldOutDevelopment(slug: string): boolean {
  return (SOLD_OUT_DEVELOPMENT_SLUGS as readonly string[]).includes(slug)
}
