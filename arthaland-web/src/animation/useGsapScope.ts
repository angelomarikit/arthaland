import { useLayoutEffect, type RefObject } from 'react'
import { gsap, initGsap } from './gsapSetup'
import { prefersReducedMotion } from './prefersReducedMotion'

export function useGsapScope(
  scopeRef: RefObject<HTMLElement | null>,
  setup: () => void | (() => void),
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    initGsap()
    const root = scopeRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      setup()
    }, root)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scoped animation setup
  }, deps)
}
