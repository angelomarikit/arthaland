import { useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../../animation/prefersReducedMotion'

type FadeInWhenVisibleProps = {
  children: ReactNode
  className?: string
}

export function FadeInWhenVisible({
  children,
  className = '',
}: FadeInWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
