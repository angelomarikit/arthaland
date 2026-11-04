import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, initGsap, ScrollTrigger } from '../../animation/gsapSetup'
import { isDesktopMotion, prefersReducedMotion } from '../../animation/prefersReducedMotion'

type ScrollMotionProviderProps = {
  children: ReactNode
}

export function ScrollMotionProvider({ children }: ScrollMotionProviderProps) {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)
  const tickerRef = useRef<((time: number) => void) | null>(null)

  useEffect(() => {
    initGsap()

    const enableLenis =
      !prefersReducedMotion() && isDesktopMotion()

    if (enableLenis) {
      document.documentElement.classList.add('lenis', 'lenis-smooth')
      document.documentElement.style.scrollBehavior = 'auto'

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      const ticker = (time: number) => {
        lenis.raf(time * 1000)
      }
      tickerRef.current = ticker
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
    }

    return () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current)
        tickerRef.current = null
      }
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
    const id = requestAnimationFrame(() => ScrollTrigger.refresh(true))
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return children
}
