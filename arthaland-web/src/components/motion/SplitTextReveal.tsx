import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'

type SplitTextRevealProps = {
  lines: string[]
  className?: string
  lineClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  triggerStart?: string
}

export function SplitTextReveal({
  lines,
  className = '',
  lineClassName = '',
  as: Tag = 'h2',
  triggerStart = 'top 82%',
}: SplitTextRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGsapScope(
    rootRef,
    () => {
      gsap.from('[data-line-inner]', {
        yPercent: 108,
        opacity: 0,
        duration: motionDuration.reveal,
        ease: motionEase.editorial,
        stagger: 0.11,
        scrollTrigger: {
          trigger: rootRef.current,
          start: triggerStart,
          toggleActions: 'play none none reverse',
        },
      })
    },
    [lines.join('|')],
  )

  return (
    <div ref={rootRef}>
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className="block overflow-hidden py-[0.06em]">
            <span
              data-line-inner
              className={`block ${lineClassName}`}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  )
}
