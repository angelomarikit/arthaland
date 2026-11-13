import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { ImageMaskReveal } from '../motion/ImageMaskReveal'
import { usePageSection } from '../../contexts/PageContentContext'
import type { LifestyleSectionContent } from '../../domain/home/types'
import { useHomeLifestyleItems } from '../../hooks/useHomeLifestyleItems'

function layoutClass(layout: 'large' | 'standard') {
  return layout === 'large'
    ? 'lg:col-span-7 lg:row-span-2'
    : 'lg:col-span-5'
}

export function LifestyleEditorialSection() {
  const copy = usePageSection('lifestyle') as LifestyleSectionContent
  const items = useHomeLifestyleItems()
  const ref = useRef<HTMLElement>(null)

  useGsapScope(
    ref,
    () => {
      gsap.from('[data-lifestyle-title]', {
        y: 36,
        opacity: 0,
        duration: motionDuration.reveal,
        ease: motionEase.editorial,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
    },
    [],
  )

  return (
    <section ref={ref} className="bg-surface py-24 md:py-32" id="lifestyle">
      <Container className="section-x">
        <Eyebrow>{copy.eyebrow ?? 'Lifestyle'}</Eyebrow>
        <h2
          data-lifestyle-title
          className="text-display-l mt-6 max-w-[14ch] text-ink"
        >
          {copy.title ?? 'Spaces shaped for calm, light, and longevity'}
        </h2>
        <p className="mt-8 max-w-xl text-title-muted whitespace-pre-line">
          {copy.body ??
            'Editorial glimpses from verified ARTHALAND project photography — interiors, landscapes, and residential facades.'}
        </p>

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {items.map((layer) => (
            <div key={layer.id} className={layoutClass(layer.layout)}>
              <ImageMaskReveal
                delay={layer.animationDelay ?? 0}
                className="aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[320px]"
              >
                <img
                  src={layer.imageUrl}
                  alt=""
                  className="size-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </ImageMaskReveal>
              <p className="text-eyebrow mt-3 text-title-muted">{layer.caption}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
