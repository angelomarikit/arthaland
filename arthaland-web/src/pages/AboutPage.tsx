import { useRef } from 'react'
import { gsap } from '../animation/gsapSetup'
import { useGsapScope } from '../animation/useGsapScope'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { ImageMaskReveal } from '../components/motion/ImageMaskReveal'
import { SplitTextReveal } from '../components/motion/SplitTextReveal'
import { ClosingCtaSection } from '../components/home/ClosingCtaSection'
import { sectionImages } from '../config/sectionImages'

export function AboutPage() {
  const openRef = useRef<HTMLElement>(null)

  useGsapScope(
    openRef,
    () => {
      gsap.from('[data-about-stat]', {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: { trigger: openRef.current, start: 'top 75%' },
      })
    },
    [],
  )

  return (
    <>
      <SiteHeader embedded />
      <section
        ref={openRef}
        className="relative min-h-[70vh] overflow-hidden bg-ink text-surface"
      >
        <img
          src={sectionImages.aboutHero}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <Container className="section-x relative flex min-h-[70vh] flex-col justify-end pb-20 pt-32">
          <Eyebrow dark>About ARTHALAND</Eyebrow>
          <SplitTextReveal
            as="h1"
            lines={['Building sustainable', 'legacies']}
            className="text-display-l mt-6 max-w-[14ch] text-surface"
            lineClassName="text-display-l"
            triggerStart="top 85%"
          />
        </Container>
      </section>

      <section className="section-x py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Company</Eyebrow>
            <h2 className="text-heading-3 mt-4">Factual summary (official site)</h2>
            <p className="mt-6 leading-relaxed text-title-muted">
              ARTHALAND Corporation is a publicly listed Philippine real estate
              developer (PSE) focused on boutique, sustainable residential and
              commercial developments. The company states that its portfolio is
              100% certified as sustainable by local and global organizations,
              with a stated commitment to a net zero development portfolio by
              2030.
            </p>
            <p className="mt-4 text-sm text-title-muted">
              Source:{' '}
              <a
                href="https://arthaland.com/"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                arthaland.com
              </a>
              . Mission/vision statements will be inserted via CMS when approved
              for this sales channel.
            </p>
          </div>
          <ImageMaskReveal className="aspect-[4/5] lg:aspect-square">
            <img
              src={sectionImages.aboutEditorial}
              alt=""
              className="size-full object-cover"
            />
          </ImageMaskReveal>
        </Container>
      </section>

      <section className="bg-surface-soft py-20">
        <Container className="section-x">
          <Eyebrow>Highlights</Eyebrow>
          <h2 className="text-heading-3 mt-4">December 2025 (corporate site)</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              '34% water savings (target 20%)',
              '54% energy savings (target 40%)',
              '97% greenhouse gas emissions avoided (target 100% by 2030)',
            ].map((item) => (
              <li
                key={item}
                data-about-stat
                className="border-t border-border pt-6 text-title-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="section-x grid gap-12 lg:grid-cols-2">
          <ImageMaskReveal delay={0.1} className="order-2 aspect-[4/3] lg:order-1">
            <img
              src={sectionImages.aboutInterior}
              alt=""
              className="size-full object-cover"
            />
          </ImageMaskReveal>
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <Eyebrow>Sales team</Eyebrow>
            <h2 className="text-heading-3 mt-4">Supervised by Mr. Gary Lee</h2>
            <p className="mt-4 max-w-xl text-title-muted">
              This website supports the ARTHALAND property sales team. Team
              biographies and photos will appear here when provided — editable via
              the admin CMS without code changes.
            </p>
            <Button href="/contact" className="mt-8">
              Get in Touch
            </Button>
          </div>
        </Container>
      </section>

      <ClosingCtaSection />
    </>
  )
}
