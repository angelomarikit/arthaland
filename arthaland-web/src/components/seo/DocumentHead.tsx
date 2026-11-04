import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '../../config/site'

const DEFAULT_TITLE = siteConfig.seo.title
const DEFAULT_DESC = siteConfig.seo.description

function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const origin =
    import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return origin ? `${origin}${path}` : path
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Updates title + OG/Twitter tags on route changes (SPA). */
export function DocumentHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = DEFAULT_TITLE
    setMeta('name', 'description', DEFAULT_DESC)
    const ogImage = absoluteUrl(siteConfig.seo.ogImage)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', siteConfig.brand.name)
    setMeta('property', 'og:title', DEFAULT_TITLE)
    setMeta('property', 'og:description', DEFAULT_DESC)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:image:alt', siteConfig.seo.ogImageAlt)
    setMeta('property', 'og:url', absoluteUrl(pathname))
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', DEFAULT_TITLE)
    setMeta('name', 'twitter:description', DEFAULT_DESC)
    setMeta('name', 'twitter:image', ogImage)
  }, [pathname])

  return null
}
