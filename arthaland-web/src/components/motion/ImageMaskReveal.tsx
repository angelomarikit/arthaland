import { useRef, type ReactNode } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'

type ImageMaskRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function ImageMaskReveal({
  children,
  className = '',
  delay = 0,
}: ImageMaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGsapScope(
    ref,
    () => {
      gsap.fromTo(
        '[data-mask-inner]',
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: motionDuration.slow,
          delay,
          ease: motionEase.cinematic,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    },
    [delay],
  )

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div data-mask-inner className="size-full">
        {children}
      </div>
    </div>
  )
}
