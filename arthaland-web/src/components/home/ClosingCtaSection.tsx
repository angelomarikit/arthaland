import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { useGsapScope } from '../../animation/useGsapScope'
import { Button } from '../ui/Button'
import { sectionImages } from '../../config/sectionImages'
import { SplitTextReveal } from '../motion/SplitTextReveal'

export function ClosingCtaSection() {
  const ref = useRef<HTMLElement>(null)

  useGsapScope(
    ref,
    () => {
      gsap.from('[data-cta-bg]', {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    },
    [],
  )

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-surface">
      <div className="absolute inset-0 overflow-hidden">
        <img
          data-cta-bg
          src={sectionImages.closingCta}
          alt=""
          className="size-full scale-110 object-cover opacity-50 will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/55" />
      </div>

      <div className="section-x relative px-6 py-28 text-center md:py-36 lg:px-20">
        <SplitTextReveal
          as="h2"
          lines={['Begin your', 'ARTHALAND inquiry']}
          className="text-display-l mx-auto max-w-[12ch] text-surface"
          lineClassName="text-display-l"
          triggerStart="top 88%"
        />
        <p className="mx-auto mt-8 max-w-lg text-surface/85">
          Request a viewing or send a message. Submissions save to Supabase when
          configured.
        </p>
        <Button
          href="/contact"
          className="mt-10 bg-surface-alt text-ink hover:bg-accent hover:text-ink"
        >
          Get in Touch
        </Button>
      </div>
    </section>
  )
}
