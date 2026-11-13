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
import { usePageSection } from '../../contexts/PageContentContext'
import { titleToDisplayLines } from '../../lib/cms/pageContentMerge'

function IntroCopyBlock({
  copy,
  titleLines,
}: {
  copy: ReturnType<typeof usePageSection>
  titleLines: string[]
}) {
  return (
    <>
      <Eyebrow>{copy.eyebrow ?? 'Introduction'}</Eyebrow>
      <SplitTextReveal
        as="h2"
        lines={titleLines}
        className="text-display-l mt-8 text-ink"
        lineClassName="text-display-l"
      />
      {copy.body ? (
        <p
          data-intro-copy
          className="mt-10 max-w-xl text-lg leading-relaxed text-title-muted whitespace-pre-line lg:max-w-2xl"
        >
          {copy.body}
        </p>
      ) : (
        <p
          data-intro-copy
          className="mt-10 max-w-xl text-lg leading-relaxed text-title-muted"
        >
          ARTHALAND develops sustainably certified residential and commercial
          properties across the Philippines — where wellness, design, and
          long-term value meet verified architectural craft.
        </p>
      )}
      <p data-intro-copy className="mt-6 max-w-lg text-title-muted">
        Sales team supervised by Mr. Gary Lee · Site by Apex Technology
      </p>
    </>
  )
}

function IntroImage({
  introImage,
  introFit,
  introPosition,
  banner,
}: {
  introImage: string
  introFit: 'cover' | 'contain'
  introPosition: string
  banner: boolean
}) {
  const intrinsic = introFit === 'contain' || banner

  return (
    <ImageMaskReveal
      fitContent={intrinsic}
      className={
        banner
          ? 'w-full rounded-sm bg-surface-soft/50'
          : introFit === 'contain'
            ? 'rounded-sm bg-surface-soft/50'
            : 'aspect-[4/5] rounded-sm bg-surface-soft/50'
      }
    >
      <ParallaxImage
        src={introImage}
        alt=""
        intrinsic={intrinsic}
        objectFit={introFit}
        objectPosition={introPosition}
        className={
          banner
            ? 'w-full h-auto'
            : introFit === 'contain'
              ? 'max-h-[min(85vh,720px)]'
              : 'aspect-[4/5]'
        }
      />
    </ImageMaskReveal>
  )
}

export function EditorialIntroSection() {
  const copy = usePageSection('introduction')
  const sectionRef = useRef<HTMLElement>(null)
  const titleLines = titleToDisplayLines(copy.title, ['A New Perspective', 'on Living.'])
  const introImage = copy.imageUrl ?? sectionImages.editorialIntro
  const introFit = copy.imageObjectFit ?? 'contain'
  const introPosition = copy.imageObjectPosition ?? 'center top'
  const introLayout =
    copy.imageLayout ?? (introFit === 'contain' ? 'banner' : 'sidebar')

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
        {introLayout === 'banner' ? (
          <div className="flex flex-col gap-12 lg:gap-16">
            <div className="max-w-3xl">
              <IntroCopyBlock copy={copy} titleLines={titleLines} />
            </div>
            <IntroImage
              introImage={introImage}
              introFit={introFit}
              introPosition={introPosition}
              banner
            />
          </div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <IntroCopyBlock copy={copy} titleLines={titleLines} />
            </div>
            <div className="lg:col-span-5 lg:self-start">
              <IntroImage
                introImage={introImage}
                introFit={introFit}
                introPosition={introPosition}
                banner={false}
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
