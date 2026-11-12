/** Detect share / directions links from Google Maps (including short goo.gl URLs). */
export function isGoogleMapsLink(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  try {
    const u = new URL(trimmed)
    const host = u.hostname.replace(/^www\./, '').toLowerCase()
    if (host === 'maps.app.goo.gl' || host === 'goo.gl') return true
    if (host === 'google.com' || host.endsWith('.google.com')) {
      return u.pathname.includes('/maps') || u.searchParams.has('q')
    }
  } catch {
    return false
  }
  return false
}

export function isUploadedMapImageUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed || isGoogleMapsLink(trimmed)) return false
  return (
    /\.(webp|jpe?g|png|gif|avif)(\?|$)/i.test(trimmed) ||
    trimmed.includes('/storage/v1/object/public/')
  )
}

/** Pull coordinates from a full Google Maps URL when present (@lat,lng or q=lat,lng). */
export function parseLatLngFromGoogleMapsUrl(
  url: string,
): { lat: number; lng: number } | null {
  const at = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (at) {
    const lat = Number(at[1])
    const lng = Number(at[2])
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
  }
  try {
    const u = new URL(url)
    const q = u.searchParams.get('q') ?? u.searchParams.get('query')
    if (q) {
      const pair = q.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/)
      if (pair) {
        const lat = Number(pair[1])
        const lng = Number(pair[2])
        if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

/**
 * iframe `src` for an embedded map without requiring admins to paste embed HTML.
 * Short share links (maps.app.goo.gl) are passed through Google's output=embed endpoint.
 */
export function googleMapsEmbedSrc(input: {
  googleMapsLink?: string
  lat?: number
  lng?: number
  embedApiKey?: string
}): string | null {
  const { googleMapsLink, lat, lng, embedApiKey } = input

  if (embedApiKey && lat != null && lng != null) {
    return `https://www.google.com/maps/embed/v1/place?key=${embedApiKey}&q=${lat},${lng}`
  }

  if (lat != null && lng != null) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  }

  const link = googleMapsLink?.trim()
  if (!link || !isGoogleMapsLink(link)) return null

  const fromUrl = parseLatLngFromGoogleMapsUrl(link)
  if (fromUrl) {
    return `https://maps.google.com/maps?q=${fromUrl.lat},${fromUrl.lng}&z=15&output=embed`
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(link)}&z=15&output=embed`
}
