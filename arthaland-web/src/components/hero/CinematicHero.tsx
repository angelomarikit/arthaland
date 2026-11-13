import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Button } from '../ui/Button'
import { ChevronDown } from 'lucide-react'
import { gsap, initGsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { heroAssets } from '../../config/assets'
import { siteConfig } from '../../config/site'
import { usePageSection } from '../../contexts/PageContentContext'
import type { HeroSectionContent } from '../../domain/home/types'
import { SiteHeader } from '../layout/SiteHeader'

export function CinematicHero() {
  const cmsHero = usePageSection('hero') as HeroSectionContent
  const reduceMotion = useReducedMotion()
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  const { hero } = siteConfig
  const heroEyebrow = cmsHero.eyebrow ?? hero.eyebrow
  const heroHeadline = cmsHero.title ?? hero.headline
  const heroSubheading = cmsHero.subtitle ?? cmsHero.body ?? hero.subheading
  const posterSrc = cmsHero.posterImageUrl?.trim() || heroAssets.poster
  const videoDesktopSrc = cmsHero.videoDesktopUrl?.trim() || heroAssets.videoDesktop
  const videoMobileSrc = cmsHero.videoMobileUrl?.trim() || heroAssets.videoMobile
  const posterPosition = cmsHero.posterObjectPosition?.trim() || 'center center'
  const videoPosition = cmsHero.videoObjectPosition?.trim() || posterPosition
  const headlineLines = heroHeadline.includes('\n')
    ? heroHeadline.split('\n').map((s) => s.trim()).filter(Boolean)
    : heroHeadline.split(' ').reduce<string[][]>((acc, word, i) => {
        const lineIndex = i < 2 ? 0 : 1
        if (!acc[lineIndex]) acc[lineIndex] = []
        acc[lineIndex].push(word)
        return acc
      }, [])

  useEffect(() => {
    if (reduceMotion) return
    const nodes = [desktopVideoRef.current, mobileVideoRef.current].filter(
      Boolean,
    ) as HTMLVideoElement[]
    const onReady = () => setVideoReady(true)
    nodes.forEach((el) => {
      el.addEventListener('loadeddata', onReady)
      void el.play().catch(() => undefined)
    })

    const section = sectionRef.current
    let observer: IntersectionObserver | undefined
    if (section) {
      observer = new IntersectionObserver(
        ([entry]) => {
          nodes.forEach((el) => {
            if (!entry?.isIntersecting) el.pause()
            else void el.play().catch(() => undefined)
          })
        },
        { threshold: 0.08 },
      )
      observer.observe(section)
    }

    return () => {
      observer?.disconnect()
      nodes.forEach((el) => el.removeEventListener('loadeddata', onReady))
    }
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    initGsap()
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        yPercent: 110,
        opacity: 0,
        duration: motionDuration.reveal,
        stagger: 0.1,
        ease: motionEase.editorial,
        delay: 0.2,
      })

      gsap.from('[data-hero-fade]', {
        y: 24,
        opacity: 0,
        duration: motionDuration.base,
        stagger: 0.08,
        ease: motionEase.editorial,
        delay: 0.55,
      })

      gsap.from('[data-hero-scroll-hint]', {
        opacity: 0,
        y: 8,
        duration: 0.8,
        delay: 1.1,
        ease: motionEase.editorial,
      })
    }, section)

    return () => ctx.revert()
  }, [reduceMotion])

  const videoClass = (mobile: boolean) =>
    `absolute inset-0 size-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'} ${mobile ? 'md:hidden' : 'hidden md:block'}`

  return (
    <section ref={sectionRef} className="relative">
      <SiteHeader embedded />

      <div className="hero-under-header relative isolate w-full overflow-hidden bg-ink">
        <div className="relative mx-auto min-h-[min(82svh,920px)] w-full max-w-[1920px] md:min-h-[min(88svh,960px)]">
          {!reduceMotion && (
            <>
              <video
                ref={desktopVideoRef}
                className={videoClass(false)}
                style={{ objectPosition: videoPosition }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={posterSrc}
              >
                <source src={videoDesktopSrc} type="video/mp4" />
              </video>
              <video
                ref={mobileVideoRef}
                className={videoClass(true)}
                style={{ objectPosition: videoPosition }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={posterSrc}
              >
                <source src={videoMobileSrc} type="video/mp4" />
              </video>
            </>
          )}

          <img
            src={posterSrc}
            alt=""
            className={`absolute inset-0 size-full object-cover ${!reduceMotion && videoReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
            style={{ objectPosition: posterPosition }}
            fetchPriority="high"
            decoding="async"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/85"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface via-surface/75 to-transparent md:h-40"
            aria-hidden
          />

          <div className="relative z-10 flex min-h-[min(82svh,920px)] flex-col justify-end px-6 pb-24 pt-28 md:min-h-[min(88svh,960px)] md:px-10 md:pb-28 lg:px-20 lg:pb-32">
            <div className="mx-auto w-full max-w-[1200px]">
              <p
                data-hero-fade
                className="text-eyebrow mb-4 flex items-center gap-2 text-surface/90"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {heroEyebrow}
              </p>

              <h1 className="max-w-[14ch] text-[clamp(2.25rem,6.5vw,8.625rem)] font-medium leading-[0.98] tracking-[-0.05em] text-surface">
                {headlineLines.map((line, i) => (
                  <span key={i} className="block overflow-hidden py-[0.04em]">
                    <span data-hero-line className="block">
                      {Array.isArray(line) ? line.join(' ') : line}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                data-hero-fade
                className="mt-6 max-w-xl text-base leading-relaxed tracking-[-0.02em] text-surface/85 md:text-lg"
              >
                {heroSubheading}
              </p>

              <div
                data-hero-fade
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
                <Button href={hero.secondaryCta.href} variant="outlineOnDark">
                  {hero.secondaryCta.label}
                </Button>
              </div>
            </div>
          </div>

          <a
            href="#introduction"
            data-hero-scroll-hint
            className="absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full bg-ink/35 px-4 py-2 text-surface/90 backdrop-blur-sm transition-colors hover:bg-ink/50 hover:text-surface md:bottom-16"
          >
            <span className="text-eyebrow">Scroll</span>
            <ChevronDown className="size-5 animate-[bounce_2s_ease-in-out_infinite]" />
          </a>
        </div>
      </div>
    </section>
  )
}
