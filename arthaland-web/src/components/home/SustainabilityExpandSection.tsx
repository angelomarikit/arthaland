import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { breakpoints, scrollScrub } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { sectionImages } from '../../config/sectionImages'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const stats = [
  { label: 'Water savings (portfolio highlight)', value: '34%' },
  { label: 'Energy savings (portfolio highlight)', value: '54%' },
  { label: 'GHG emissions avoided', value: '97%' },
  { label: 'Net zero portfolio target', value: '2030' },
]

export function SustainabilityExpandSection() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useGsapScope(
    wrapRef,
    () => {
      const mm = gsap.matchMedia()

      mm.add(breakpoints.desktop, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 70%',
            end: 'bottom top',
            scrub: scrollScrub.soft,
          },
        })

        tl.fromTo(
          mediaRef.current,
          {
            width: '72%',
            height: '58vh',
            borderRadius: '2px',
          },
          {
            width: '100%',
            height: '100vh',
            borderRadius: 0,
            ease: 'none',
          },
          0,
        ).fromTo(
          copyRef.current,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, ease: 'none' },
          0.35,
        )
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.from(copyRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: wrapRef.current, start: 'top 80%' },
        })
      })
    },
    [],
  )

  return (
    <section ref={wrapRef} className="relative bg-surface-soft py-24 md:py-32">
      <Container className="section-x mb-10 lg:hidden">
        <Eyebrow>Sustainability</Eyebrow>
        <h2 className="text-heading-2 mt-4 max-w-[18ch]">
          Certified developments with measurable environmental performance
        </h2>
        <p className="mt-4 text-title-muted">
          Figures below are corporate highlights from arthaland.com (December 2025).
        </p>
      </Container>
      <Container className="section-x flex justify-center">
        <div
          ref={mediaRef}
          className="relative mx-auto overflow-hidden will-change-[width,height]"
          style={{ width: '100%', height: 'min(52vh, 480px)' }}
        >
          <img
            src={sectionImages.sustainability}
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div
            ref={copyRef}
            className="relative hidden h-full flex-col justify-end p-8 text-surface md:p-14 lg:flex"
          >
            <Eyebrow dark>Sustainability</Eyebrow>
            <h2 className="text-heading-2 mt-4 max-w-[18ch]">
              Certified developments with measurable environmental performance
            </h2>
            <p className="mt-4 max-w-xl text-sm text-surface/85 md:text-base">
              Figures below are corporate highlights published on arthaland.com
              (December 2025). Individual projects may exceed these targets.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-sm text-surface/70">{stat.label}</p>
                  <p className="text-display-m mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <Container className="section-x mt-12 lg:hidden">
        <div className="grid gap-8 sm:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="border-t border-border pt-4">
              <p className="text-sm text-title-muted">{stat.label}</p>
              <p className="text-display-m mt-2 text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
