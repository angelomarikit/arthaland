import { ScrollTrigger } from '../animation/gsapSetup'

/** Disable browser scroll restoration — we control position on route change / reload. */
export function disableBrowserScrollRestoration() {
  if (typeof window === 'undefined') return
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}

export function scrollToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** GSAP can restore scroll memory on refresh; clear before resetting position. */
export function clearGsapScrollMemory() {
  ScrollTrigger.clearScrollMemory()
}

/** Keep scroll within document bounds after async layout shifts. */
export function clampScrollToDocument() {
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  if (window.scrollY > max) {
    window.scrollTo({ top: max, left: 0, behavior: 'auto' })
  }
}

export function scrollToLocationHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ block: 'start', behavior: 'auto' })
  }
}

/** Reset to top on navigation/reload unless the URL targets an in-page anchor. */
export function applyRouteScrollReset(hash: string) {
  if (hash) {
    requestAnimationFrame(() => scrollToLocationHash(hash))
    return
  }

  clearGsapScrollMemory()
  scrollToTopInstant()

  requestAnimationFrame(() => {
    scrollToTopInstant()
    clampScrollToDocument()
    ScrollTrigger.refresh(false)
  })
}
