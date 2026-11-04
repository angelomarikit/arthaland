import type Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsapSetup'

/**
 * Single supported Lenis ↔ ScrollTrigger bridge (desktop only).
 * Uses scrollerProxy so ST reads Lenis scroll position, not native window scroll.
 */
export function connectLenisScrollTrigger(lenis: Lenis) {
  const root = document.documentElement

  ScrollTrigger.scrollerProxy(root, {
    scrollTop(value?: number) {
      if (value !== undefined) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  })

  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)

  const onRefresh = () => lenis.resize()
  ScrollTrigger.addEventListener('refresh', onRefresh)

  const ticker = () => {
    lenis.raf(performance.now())
  }
  gsap.ticker.add(ticker)

  return () => {
    gsap.ticker.remove(ticker)
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    lenis.off('scroll', onScroll)
    ScrollTrigger.scrollerProxy(root, {})
  }
}
