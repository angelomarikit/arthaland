import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { scrollScrub } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { breakpoints } from '../../animation/motionTokens'

type ParallaxImageProps = {
  src: string
  alt?: string
  className?: string
  speed?: number
}

export function ParallaxImage({
  src,
  alt = '',
  className = '',
  speed = 12,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGsapScope(
    ref,
    () => {
      const mm = gsap.matchMedia()
      mm.add(breakpoints.desktop, () => {
        gsap.to('[data-parallax-img]', {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: scrollScrub.soft,
          },
        })
      })
      mm.add('(max-width: 1023px)', () => {
        gsap.set('[data-parallax-img]', { yPercent: 0 })
      })
    },
    [speed, src],
  )

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <img
        data-parallax-img
        src={src}
        alt={alt}
        className="size-full scale-110 object-cover will-change-transform"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
