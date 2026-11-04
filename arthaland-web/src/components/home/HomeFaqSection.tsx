import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FaqAccordion } from '../faq/FaqAccordion'
import { faqItems } from '../../data/faqs'
import { Link } from 'react-router-dom'

export function HomeFaqSection() {
  return (
    <section className="bg-surface-soft pb-24 pt-20 md:pb-[130px] md:pt-[120px]">
      <Container className="section-x">
        <Eyebrow>questions</Eyebrow>
        <h2 className="text-heading-2 mt-4">The things people ask us first</h2>
        <p className="mt-4 max-w-xl text-title-muted">
          If yours is not here, use the Help widget, visit our{' '}
          <Link to="/faq" className="font-medium text-ink underline underline-offset-4">
            FAQ page
          </Link>
          , or call{' '}
          <a href="tel:+63284036910" className="underline">
            +63 2 8403 6910
          </a>{' '}
          (ARTHALAND corporate office, per arthaland.com).
        </p>
        <div className="mt-12">
          <FaqAccordion items={faqItems.slice(0, 6)} defaultOpenIndex={0} />
        </div>
        <Link
          to="/faq"
          className="text-nav mt-8 inline-block font-medium underline underline-offset-4"
        >
          View all questions
        </Link>
      </Container>
    </section>
  )
}
