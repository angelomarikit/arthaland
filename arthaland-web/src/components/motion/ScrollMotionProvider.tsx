import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { initGsap, ScrollTrigger } from '../../animation/gsapSetup'
import {
  applyRouteScrollReset,
  disableBrowserScrollRestoration,
  scrollToTopInstant,
} from '../../lib/scrollReset'

type ScrollMotionProviderProps = {
  children: ReactNode
}

/** Native browser scroll only — no Lenis or virtual scroll interception. */
export function ScrollMotionProvider({ children }: ScrollMotionProviderProps) {
  const location = useLocation()

  useEffect(() => {
    initGsap()
    disableBrowserScrollRestoration()
    document.documentElement.classList.remove('lenis', 'lenis-smooth')
    document.documentElement.style.scrollBehavior = 'auto'

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !window.location.hash) {
        applyRouteScrollReset('')
      }
    }
    window.addEventListener('pageshow', onPageShow)

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    applyRouteScrollReset(location.hash)
    const t = window.setTimeout(() => {
      if (!location.hash) scrollToTopInstant()
      ScrollTrigger.refresh(false)
    }, 0)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.hash])

  return children
}
