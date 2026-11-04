import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { initGsap, ScrollTrigger } from '../../animation/gsapSetup'
import { connectLenisScrollTrigger } from '../../animation/lenisScrollTrigger'
import { isDesktopMotion, prefersReducedMotion } from '../../animation/prefersReducedMotion'

type ScrollMotionProviderProps = {
  children: ReactNode
}

export function ScrollMotionProvider({ children }: ScrollMotionProviderProps) {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)
  const disconnectRef = useRef<(() => void) | null>(null)
  const refreshTimerRef = useRef<number | null>(null)

  useEffect(() => {
    initGsap()

    const enableLenis =
      !prefersReducedMotion() && isDesktopMotion()

    if (enableLenis) {
      document.documentElement.classList.add('lenis', 'lenis-smooth')
      document.documentElement.style.scrollBehavior = 'auto'

      const lenis = new Lenis({
        lerp: 0.15,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        autoRaf: false,
      })
      lenisRef.current = lenis
      disconnectRef.current = connectLenisScrollTrigger(lenis)
    }

    return () => {
      disconnectRef.current?.()
      disconnectRef.current = null
      lenisRef.current?.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      document.documentElement.style.scrollBehavior = ''
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    lenisRef.current?.scrollTo(0, { immediate: true })

    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current)
    }
    refreshTimerRef.current = window.setTimeout(() => {
      ScrollTrigger.refresh(false)
      refreshTimerRef.current = null
    }, 120)

    return () => {
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current)
      }
    }
  }, [location.pathname])

  return children
}
