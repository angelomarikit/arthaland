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

export function isShortGoogleMapsLink(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname.replace(/^www\./, '').toLowerCase()
    return host === 'maps.app.goo.gl' || host === 'goo.gl'
  } catch {
    return false
  }
}

export function isUploadedMapImageUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed || isGoogleMapsLink(trimmed)) return false
  return (
    /\.(webp|jpe?g|png|gif|avif)(\?|$)/i.test(trimmed) ||
    trimmed.includes('/storage/v1/object/public/')
  )
}

/** Pull coordinates from a full Google Maps URL when present (@lat,lng, !3d!4d, or q=lat,lng). */
export function parseLatLngFromGoogleMapsUrl(
  url: string,
): { lat: number; lng: number } | null {
  const at = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (at) {
    const lat = Number(at[1])
    const lng = Number(at[2])
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
  }

  const bang = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  if (bang) {
    const lat = Number(bang[1])
    const lng = Number(bang[2])
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
    const ll = u.searchParams.get('ll')
    if (ll) {
      const pair = ll.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/)
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

/** Text place name from a full Maps URL (`q=Place+Name`). */
export function parsePlaceQueryFromGoogleMapsUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const q = u.searchParams.get('q') ?? u.searchParams.get('query')
    if (!q) return null
    if (/^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/.test(q.trim())) return null
    return q.trim()
  } catch {
    return null
  }
}

/** Use official embed `pb` payload when present in a Maps URL. */
export function googleMapsEmbedPbSrc(url: string): string | null {
  const trimmed = url.trim()
  const fromEmbed = trimmed.match(/\/maps\/embed\?pb=([^&]+)/)
  if (fromEmbed) {
    return `https://www.google.com/maps/embed?pb=${fromEmbed[1]}`
  }
  try {
    const u = new URL(trimmed)
    const pb = u.searchParams.get('pb')
    if (pb) return `https://www.google.com/maps/embed?pb=${pb}`
  } catch {
    /* ignore */
  }
  return null
}

function legacyPlaceEmbed(q: string, zoom = 15): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`
}

function embedApiPlace(
  embedApiKey: string,
  q: string,
  zoom = 15,
): string {
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedApiKey)}&q=${encodeURIComponent(q)}&zoom=${zoom}`
}

/**
 * iframe `src` for an embedded map.
 * Never pass a raw short share URL as `q` — that shows a world map.
 */
export function googleMapsEmbedSrc(input: {
  googleMapsLink?: string
  lat?: number
  lng?: number
  embedApiKey?: string
  /** Property address line from CMS — used when the share link has no coordinates */
  placeQuery?: string
}): string | null {
  const { googleMapsLink, lat, lng, embedApiKey, placeQuery } = input
  const link = googleMapsLink?.trim()
  const place = placeQuery?.trim()

  const coords =
    lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
      ? { lat, lng }
      : link
        ? parseLatLngFromGoogleMapsUrl(link)
        : null

  if (embedApiKey) {
    if (coords) {
      return embedApiPlace(embedApiKey, `${coords.lat},${coords.lng}`)
    }
    const fromLink = link && !isShortGoogleMapsLink(link) ? parsePlaceQueryFromGoogleMapsUrl(link) : null
    const q = fromLink || place
    if (q) return embedApiPlace(embedApiKey, q)
  }

  if (coords) {
    return legacyPlaceEmbed(`${coords.lat},${coords.lng}`)
  }

  if (link && !isShortGoogleMapsLink(link)) {
    const pbSrc = googleMapsEmbedPbSrc(link)
    if (pbSrc) return pbSrc

    const fromLink = parsePlaceQueryFromGoogleMapsUrl(link)
    if (fromLink) return legacyPlaceEmbed(fromLink)
  }

  if (place) {
    return legacyPlaceEmbed(place.includes('Philippines') ? place : `${place}, Philippines`)
  }

  return null
}
