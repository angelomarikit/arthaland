import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { sectionImages } from '../config/sectionImages'

const approachItems = [
  {
    title: 'Property guidance',
    body: 'Clear answers drawn from verified ARTHALAND development information.',
  },
  {
    title: 'Responsive communication',
    body: 'Timely follow-up on inquiries submitted through this website.',
  },
  {
    title: 'Development knowledge',
    body: 'Familiarity with published amenities, sustainability features, and timelines.',
  },
  {
    title: 'Viewing coordination',
    body: 'Scheduling show suites or model visits where available.',
  },
]

export function TeamPage() {
  return (
    <>
      <SiteHeader embedded />
      <section className="hero-under-header relative min-h-[55vh] overflow-hidden bg-ink text-surface md:min-h-[60vh]">
        <img
          src={sectionImages.teamHero}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <Container className="section-x relative flex min-h-[55vh] flex-col justify-end pb-16 pt-32 md:min-h-[60vh] md:pb-20">
          <Eyebrow dark>Our team</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[14ch] animate-fade-up">
            <span className="block">People Behind Your</span>
            <span className="block">Property Journey.</span>
          </h1>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="section-x">
          <FadeInWhenVisible className="max-w-2xl">
            <Eyebrow>Sales channel</Eyebrow>
            <h2 className="text-heading-3 mt-4">
              A dedicated team for buyers exploring ARTHALAND residences
            </h2>
            <p className="mt-6 leading-relaxed text-title-muted">
              This site represents the property sales team supervised by Mr. Gary
              Lee — separate from ARTHALAND corporate communications. The team
              focuses on consultation, verified materials, and viewing coordination
              for published developments.
            </p>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="bg-surface-soft py-16 md:py-24">
        <Container className="section-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <FadeInWhenVisible className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <img
                src={sectionImages.teamLeadership}
                alt=""
                className="size-full object-cover opacity-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 flex size-24 items-center justify-center border border-surface/40 bg-ink/40 text-3xl font-light tracking-[-0.05em] text-surface backdrop-blur-sm">
                GL
              </div>
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible className="lg:col-span-7">
            <Eyebrow>Leadership</Eyebrow>
            <h2 className="text-heading-2 mt-4">Mr. Gary Lee</h2>
            <p className="text-nav mt-2 text-title-muted">Sales Team Supervisor</p>
            <p className="mt-6 max-w-xl leading-relaxed text-title-muted">
              An approved portrait and extended biography will be published when
              supplied by the team. Until then, we present leadership by name and
              role — without substituting stock photography for a real team member.
            </p>
            <Button href="/contact" className="mt-8">
              Connect with the Team
            </Button>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="section-x">
          <FadeInWhenVisible>
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="text-heading-3 mt-4">How we work with buyers</h2>
          </FadeInWhenVisible>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {approachItems.map((item) => (
              <FadeInWhenVisible key={item.title}>
                <li className="border-t border-border pt-8">
                  <h3 className="text-xl font-medium tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-title-muted">{item.body}</p>
                </li>
              </FadeInWhenVisible>
            ))}
          </ul>
        </Container>
      </section>

      <PageConsultCta
        title="Connect with the sales team"
        body="Share your development interest or request a viewing through our inquiry form."
      />
    </>
  )
}
