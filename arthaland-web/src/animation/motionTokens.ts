export const motionEase = {
  editorial: 'power3.out',
  cinematic: 'power2.inOut',
  scroll: 'none',
} as const

export const motionDuration = {
  fast: 0.45,
  base: 0.85,
  slow: 1.2,
  reveal: 1.05,
} as const

export const scrollScrub = {
  soft: 0.65,
  firm: 1,
} as const

export const breakpoints = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 810px)',
} as const
