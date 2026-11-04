import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../../animation/gsapSetup'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? ('instant' as ScrollBehavior) : 'auto' })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh(true))
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}
