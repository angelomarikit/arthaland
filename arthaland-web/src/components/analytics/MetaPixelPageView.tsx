import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Fires PageView on client-side route changes only.
 * The first view is already counted by the snippet in index.html.
 */
export function MetaPixelPageView() {
  const location = useLocation()
  const skipFirst = useRef(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.fbq) return
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    window.fbq('track', 'PageView')
  }, [location.pathname, location.search, location.hash])

  return null
}
