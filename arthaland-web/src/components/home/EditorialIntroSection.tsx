import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { ImageMaskReveal } from '../motion/ImageMaskReveal'
import { ParallaxImage } from '../motion/ParallaxImage'
import { SplitTextReveal } from '../motion/SplitTextReveal'
import { sectionImages } from '../../config/sectionImages'

export function EditorialIntroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGsapScope(
    sectionRef,
    () => {
      gsap.from('[data-intro-copy]', {
        y: 32,
        opacity: 0,
        duration: motionDuration.base,
        stagger: 0.08,
        ease: motionEase.editorial,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      })
    },
    [],
  )

  return (
    <section
      ref={sectionRef}
      id="introduction"
      className="relative bg-surface py-24 md:py-32 lg:py-40"
    >
      <Container className="section-x">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>Introduction</Eyebrow>
            <SplitTextReveal
              as="h2"
              lines={['A New Perspective', 'on Living.']}
              className="text-display-l mt-8 text-ink"
              lineClassName="text-display-l"
            />
            <p
              data-intro-copy
              className="mt-10 max-w-xl text-lg leading-relaxed text-title-muted"
            >
              ARTHALAND develops sustainably certified residential and commercial
              properties across the Philippines — where wellness, design, and
              long-term value meet verified architectural craft.
            </p>
            <p data-intro-copy className="mt-6 max-w-lg text-title-muted">
              Sales team supervised by Mr. Gary Lee · Site by Apex Technology
            </p>
          </div>
          <div className="lg:col-span-5">
            <ImageMaskReveal className="aspect-[4/5]">
              <ParallaxImage
                src={sectionImages.editorialIntro}
                className="aspect-[4/5]"
                speed={8}
              />
            </ImageMaskReveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
