import { Link } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Button } from '../components/ui/Button'
import { FaqAccordion } from '../components/faq/FaqAccordion'
import { faqItems } from '../data/faqs'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { siteConfig } from '../config/site'

export function FaqPage() {
  return (
    <>
      <SiteHeader />
      <section className="border-b border-border bg-surface-soft pt-28 pb-12 md:pt-36 md:pb-16">
        <Container className="section-x max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="text-display-m mt-4 max-w-[16ch]">
            Answers before you reach out
          </h1>
          <p className="mt-6 max-w-xl text-title-muted leading-relaxed">
            Common questions about ARTHALAND developments, this sales channel, and
            how to inquire. Still need help? Use the Help widget (bottom-right) or
            the{' '}
            <Link to="/contact" className="font-medium text-ink underline">
              Contact
            </Link>{' '}
            page.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="section-x max-w-3xl">
          <FaqAccordion items={faqItems} defaultOpenIndex={0} />
          <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-10">
            <Button href="/contact">Contact sales team</Button>
            {siteConfig.contact.salesPhones.map((p) => (
              <Button key={p.tel} href={`tel:${p.tel}`} variant="outline" size="compact">
                {p.display}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <PageConsultCta
        eyebrow="Still have questions?"
        title="We are here to help"
        body="Send an inquiry and our sales team will respond with verified information."
      />
    </>
  )
}
