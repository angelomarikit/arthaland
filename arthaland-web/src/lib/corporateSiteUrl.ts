const CORPORATE_HOSTS = new Set(['arthaland.com', 'www.arthaland.com'])

/** True for https://arthaland.com and property paths — not partners.* email domains. */
export function isCorporateArthalandWebsiteUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false
  try {
    const host = new URL(url.trim()).hostname.toLowerCase()
    return CORPORATE_HOSTS.has(host)
  } catch {
    return /^https?:\/\/(www\.)?arthaland\.com(\/|$)/i.test(url.trim())
  }
}

/** Drop corporate-site URLs so they are never linked from this sales channel. */
export function sanitizeOfficialUrl(url: string | null | undefined): string {
  if (!url?.trim()) return ''
  if (isCorporateArthalandWebsiteUrl(url)) return ''
  return url.trim()
}
