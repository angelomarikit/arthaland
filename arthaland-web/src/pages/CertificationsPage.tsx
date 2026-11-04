import { SiteHeader } from '../components/layout/SiteHeader'
import { CertificationStandardBlock } from '../components/certifications/CertificationStandardBlock'
import { FaqAccordion } from '../components/faq/FaqAccordion'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { certificationLogos } from '../config/certificationLogos'
import { sectionImages } from '../config/sectionImages'
import {
  buyerQuestions,
  certificationStandards,
  certificationsFaq,
  sustainabilityReasons,
} from '../data/certificationsContent'

export function CertificationsPage() {
  return (
    <>
      <SiteHeader embedded />
      <section className="relative min-h-[72vh] overflow-hidden bg-ink text-surface">
        <img
          src={sectionImages.sustainability}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <Container className="section-x relative flex min-h-[72vh] flex-col justify-end pb-20 pt-32 md:pb-24">
          <Eyebrow dark>Sustainability</Eyebrow>
          <h1 className="text-display-l mt-6 max-w-[14ch] animate-fade-up">
            Building Sustainable Legacies
          </h1>
          <p className="mt-6 max-w-xl text-lg text-surface/85 animate-fade-up animation-delay-150">
            A better way to live. A more responsible way to build.
          </p>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-14 md:py-20">
        <Container className="section-x max-w-3xl">
          <FadeInWhenVisible>
            <p className="text-lg font-medium tracking-[-0.02em] text-ink">
              Thoughtfully designed spaces. Healthier living environments. A more sustainable
              future.
            </p>
            <p className="mt-6 leading-relaxed text-title-muted">
              A home is more than a place to live. It is where families grow, memories are created,
              and everyday experiences shape our quality of life.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              At ARTHALAND, sustainability is central to the philosophy of creating developments
              that consider not only architectural beauty but also environmental responsibility,
              human well-being, and long-term building performance.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              From efficient use of energy and water to thoughtful building materials and healthier
              indoor environments, sustainable development means creating spaces that are designed
              with both people and the planet in mind.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              By incorporating internationally recognized and locally relevant green building
              principles, ARTHALAND aims to create residential and commercial environments that
              support a better way of living.
            </p>
            <p className="mt-8 font-medium text-ink">
              Discover how sustainable design can make a meaningful difference to the place you call
              home.
            </p>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="border-b border-border bg-surface-soft py-10 md:py-12">
        <Container className="section-x">
          <ul className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {certificationLogos.map((logo) => (
              <li key={logo.src} className="flex shrink-0 items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-14 w-auto max-w-[min(40vw,200px)] object-contain md:h-20 lg:h-24"
                  loading="eager"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x max-w-3xl">
          <FadeInWhenVisible>
            <Eyebrow>Frameworks</Eyebrow>
            <h2 className="text-heading-2 mt-4">Four Standards. One Commitment to Better Buildings.</h2>
            <h3 className="text-heading-3 mt-8">Understanding Green Building Certifications</h3>
            <p className="mt-4 leading-relaxed text-title-muted">
              Not all buildings are designed and evaluated in the same way.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              Green building certification systems provide structured frameworks for assessing
              important aspects of building design, construction, operations, resource efficiency,
              and occupant well-being.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              Different certification systems focus on different priorities. Some evaluate overall
              environmental performance, others emphasize health and comfort, while some measure
              resource savings. Together, they offer buyers a better understanding of the standards
              and sustainability objectives associated with a development.
            </p>
          </FadeInWhenVisible>
        </Container>
      </section>

      {certificationStandards.map((standard, index) => (
        <CertificationStandardBlock
          key={standard.id}
          {...standard}
          reverse={index % 2 === 1}
        />
      ))}

      <section className="border-t border-border bg-surface-soft py-16 md:py-24">
        <Container className="section-x max-w-3xl">
          <FadeInWhenVisible>
            <Eyebrow>Buyer guide</Eyebrow>
            <h2 className="text-heading-2 mt-4">
              Why Sustainability Matters When Buying a Condominium
            </h2>
            <p className="mt-4 text-lg font-medium tracking-[-0.02em]">
              Your Home Should Support More Than Your Lifestyle Today.
            </p>
            <p className="mt-6 leading-relaxed text-title-muted">
              Buying a condominium is a major decision. While location, layout, amenities, and
              price are essential considerations, the way a building is designed and operated also
              deserves attention. Sustainability introduces another important dimension to property
              ownership: how the development uses resources, responds to its environment, and
              supports its occupants.
            </p>
          </FadeInWhenVisible>
          <ol className="mt-12 space-y-6">
            {sustainabilityReasons.map((item, i) => (
              <FadeInWhenVisible key={item.title}>
                <li className="border border-border bg-surface p-6 md:p-8">
                  <p className="text-eyebrow text-title-muted">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-heading-3 mt-2">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-title-muted">{item.body}</p>
                </li>
              </FadeInWhenVisible>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x max-w-3xl">
          <FadeInWhenVisible>
            <Eyebrow>Value</Eyebrow>
            <h2 className="text-heading-2 mt-4">Sustainability and Property Value</h2>
            <p className="mt-4 text-lg font-medium tracking-[-0.02em]">
              Looking Beyond the Initial Purchase Price
            </p>
            <p className="mt-6 leading-relaxed text-title-muted">
              A condominium is both a place to live and, for many buyers, a significant long-term
              financial commitment. While purchase price, location, demand, market conditions, and
              property management remain important considerations, sustainability can also
              contribute to how buyers evaluate a development.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              Well-designed and resource-efficient buildings may offer advantages in operational
              efficiency, occupant comfort, and long-term market appeal. However, certification
              does not guarantee higher property appreciation, rental income, lower association
              dues, or future resale value.
            </p>
            <p className="mt-4 leading-relaxed text-title-muted">
              The real value of sustainable design lies in the quality, efficiency, and performance
              objectives that support the overall property experience.
            </p>
            <blockquote className="mt-8 border-l-2 border-accent-deep pl-5 text-lg font-medium tracking-[-0.02em]">
              A more thoughtful investment begins with understanding not just what you are buying,
              but how the property is designed to perform.
            </blockquote>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="border-y border-border bg-ink py-16 text-surface md:py-24">
        <Container className="section-x max-w-3xl">
          <FadeInWhenVisible>
            <Eyebrow dark>Due diligence</Eyebrow>
            <h2 className="text-heading-2 mt-4 text-surface">
              Choosing a Property With Confidence
            </h2>
            <p className="mt-4 text-lg text-surface/85">Questions Worth Asking Before You Buy</p>
            <p className="mt-6 leading-relaxed text-surface/75">
              Understanding certification labels is only the beginning. When exploring an ARTHALAND
              development, buyers are encouraged to ask:
            </p>
            <ol className="mt-8 list-decimal space-y-3 pl-5 text-surface/90 marker:text-accent">
              {buyerQuestions.map((q) => (
                <li key={q} className="leading-relaxed">
                  {q}
                </li>
              ))}
            </ol>
            <p className="mt-8 leading-relaxed text-surface/75">
              These questions help make sustainability a practical consideration rather than simply
              a marketing statement. Our sales team can assist in presenting the available
              development information and directing project-specific technical questions to the
              appropriate representatives.
            </p>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x max-w-3xl text-center">
          <FadeInWhenVisible>
            <Eyebrow>Developments</Eyebrow>
            <h2 className="text-heading-2 mt-4">Experience a More Considered Way of Living</h2>
            <p className="mt-4 text-lg font-medium">Discover ARTHALAND Developments</p>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-title-muted">
              A residence should complement the life you want to build. Whether you prioritize
              contemporary design, a comfortable living environment, responsible resource use, or
              access to thoughtfully planned residential spaces, exploring the development&apos;s
              features can help you make a more informed decision.
            </p>
            <Button href="/properties" className="mt-10">
              Explore Our Properties
            </Button>
          </FadeInWhenVisible>
        </Container>
      </section>

      <section className="border-t border-border bg-surface-soft py-16 md:py-24">
        <Container className="section-x max-w-3xl">
          <FadeInWhenVisible>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-heading-2 mt-4">Frequently Asked Questions</h2>
          </FadeInWhenVisible>
          <div className="mt-10">
            <FaqAccordion items={certificationsFaq} defaultOpenIndex={0} />
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <Container className="section-x max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-title-muted">
            With ARTHALAND, you are choosing more than a condominium. You are exploring a home
            shaped by a commitment to responsible development, considered design, and better living
            environments.
          </p>
          <p className="mt-6 text-display-m text-ink">Building Sustainable Legacies.</p>
        </Container>
      </section>

      <PageConsultCta
        eyebrow="Your next chapter"
        title="Let's find a property that fits your future"
        body="Discover spaces designed with tomorrow in mind. Request a property consultation with the ARTHALAND sales team."
      />
    </>
  )
}
