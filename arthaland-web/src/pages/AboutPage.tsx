import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { sectionImages } from '../config/sectionImages'
import { usePageSection } from '../contexts/PageContentContext'
import { titleToDisplayLines } from '../lib/cms/pageContentMerge'

const sustainabilityStats = [
  {
    value: '34%',
    label: 'Water savings',
    note: 'Corporate portfolio target: 20%',
  },
  {
    value: '54%',
    label: 'Energy savings',
    note: 'Corporate portfolio target: 40%',
  },
  {
    value: '97%',
    label: 'GHG emissions avoided',
    note: 'Toward 100% target by 2030',
  },
]

export function AboutPage() {
  const hero = usePageSection('hero')
  const who = usePageSection('who-we-are')
  const vision = usePageSection('architectural-vision')
  const statsSection = usePageSection('sustainability-stats')
  const living = usePageSection('approach-to-living')
  const sales = usePageSection('sales-channel')
  const heroLines = titleToDisplayLines(hero.title, ['Building Beyond', 'Expectations.'])

  return (
    <>
      <SiteHeader embedded />
      <section className="relative min-h-[70vh] overflow-hidden bg-ink text-surface">
        <img
          src={sectionImages.aboutHero}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <Container className="section-x relative flex min-h-[70vh] flex-col justify-end pb-20 pt-32">
          <Eyebrow dark>{hero.eyebrow ?? 'About ARTHALAND'}</Eyebrow>
          <h1 className="text-display-l mt-6 max-w-[14ch] animate-fade-up">
            {heroLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="section-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeInWhenVisible>
            <Eyebrow>{who.eyebrow ?? 'Who we are'}</Eyebrow>
            <h2 className="text-heading-3 mt-4">
              {who.title ?? 'Boutique developments with sustainability at the core'}
            </h2>
            <p className="mt-6 leading-relaxed text-title-muted whitespace-pre-line">
              {who.body ??
                'ARTHALAND Corporation is a publicly listed Philippine real estate developer focused on thoughtfully scaled residential and commercial projects. The company reports that its portfolio is certified as sustainable by local and global organizations, with a stated commitment to a net-zero development portfolio by 2030.'}
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              Learn more on the corporate site at{' '}
              <a
                href="https://arthaland.com/"
                className="text-ink underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                arthaland.com
              </a>
              .
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <div className="aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
              <img
                src={sectionImages.aboutEditorial}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-surface md:py-32">
        <img
          src={sectionImages.aboutVision}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <Container className="section-x relative max-w-3xl">
          <FadeInWhenVisible>
            <Eyebrow dark>{vision.eyebrow ?? 'Architectural vision'}</Eyebrow>
            <h2 className="text-heading-2 mt-4">
              {vision.title ?? 'Design that respects light, landscape, and long-term living'}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-surface/80 whitespace-pre-line">
              {vision.body ??
                'From low-density addresses in Makati to wellness-led towers in Cebu and garden communities in Laguna, ARTHALAND pairs architectural rigor with environments meant to be lived in — not merely viewed.'}
            </p>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="bg-surface-soft py-20 md:py-28">
        <Container className="section-x">
          <FadeInWhenVisible>
            <Eyebrow>{statsSection.eyebrow ?? 'Sustainability'}</Eyebrow>
            <h2 className="text-heading-3 mt-4">
              {statsSection.title ?? 'Measured progress across the portfolio'}
            </h2>
            <p className="mt-4 max-w-2xl text-title-muted whitespace-pre-line">
              {statsSection.body ??
                'Figures below reflect corporate reporting published on arthaland.com (December 2025). Individual developments may publish additional certifications and targets.'}
            </p>
          </FadeInWhenVisible>
          <ul className="mt-14 grid gap-10 sm:grid-cols-3">
            {sustainabilityStats.map((stat) => (
              <FadeInWhenVisible key={stat.label}>
                <li className="border-t border-border pt-8">
                  <p className="text-display-m">{stat.value}</p>
                  <p className="mt-3 text-lg font-medium">{stat.label}</p>
                  <p className="mt-2 text-sm text-title-muted">{stat.note}</p>
                </li>
              </FadeInWhenVisible>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="section-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <FadeInWhenVisible className="order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={sectionImages.aboutLiving}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible className="order-1 lg:order-2">
            <Eyebrow>{living.eyebrow ?? 'Approach to living'}</Eyebrow>
            <h2 className="text-heading-3 mt-4">
              {living.title ?? 'Wellness, community, and responsible design'}
            </h2>
            <p className="mt-6 leading-relaxed text-title-muted whitespace-pre-line">
              {living.body ??
                'Potager gardens, efficient envelopes, and amenity programs that encourage movement and connection recur across ARTHALAND projects. The intent is residential environments that feel calm, durable, and aligned with how people actually live.'}
            </p>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="border-t border-border bg-surface-soft py-20 md:py-28">
        <Container className="section-x grid gap-12 lg:grid-cols-2">
          <FadeInWhenVisible>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={sectionImages.aboutInterior}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible className="flex flex-col justify-center">
            <Eyebrow>{sales.eyebrow ?? 'Sales team channel'}</Eyebrow>
            <h2 className="text-heading-3 mt-4">
              {sales.title ?? 'Supervised by Mr. Gary Lee'}
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-title-muted whitespace-pre-line">
              {sales.body ??
                'This website is the ARTHALAND property sales team channel — distinct from the corporate site. Mr. Gary Lee supervises the team assisting buyers with development information, viewings where available, and inquiry follow-up.'}
            </p>
            <Button href="/contact" className="mt-8">
              Request a Consultation
            </Button>
          </FadeInWhenVisible>
        </Container>
      </section>

      <PageConsultCta />
    </>
  )
}
