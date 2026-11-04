import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from '../../animation/gsapSetup'
import { prefersReducedMotion } from '../../animation/prefersReducedMotion'

type PageTransitionProps = {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    )
  }, [location.pathname])

  return (
    <div ref={ref} className="flex flex-1 flex-col">
      {children}
    </div>
  )
}
