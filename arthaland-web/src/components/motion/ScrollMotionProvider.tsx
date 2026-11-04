import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { initGsap, ScrollTrigger } from '../../animation/gsapSetup'

type ScrollMotionProviderProps = {
  children: ReactNode
}

/** Native browser scroll only — no Lenis or virtual scroll interception. */
export function ScrollMotionProvider({ children }: ScrollMotionProviderProps) {
  const location = useLocation()

  useEffect(() => {
    initGsap()
    document.documentElement.classList.remove('lenis', 'lenis-smooth')
    document.documentElement.style.scrollBehavior = 'auto'

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? ('instant' as ScrollBehavior) : 'auto' })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh(false))
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return children
}
