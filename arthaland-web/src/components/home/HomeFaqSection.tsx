import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FaqAccordion } from '../faq/FaqAccordion'
import { faqItems } from '../../data/faqs'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { usePageSection } from '../../contexts/PageContentContext'

export function HomeFaqSection() {
  const copy = usePageSection('faq')
  return (
    <section className="bg-surface-soft pb-24 pt-20 md:pb-[130px] md:pt-[120px]">
      <Container className="section-x">
        <Eyebrow>{copy.eyebrow ?? 'questions'}</Eyebrow>
        <h2 className="text-heading-2 mt-4">
          {copy.title ?? 'The things people ask us first'}
        </h2>
        <p className="mt-4 max-w-xl text-title-muted whitespace-pre-line">
          {copy.body ? (
            copy.body
          ) : (
            <>
          If yours is not here, use the Help widget, visit our{' '}
          <Link to="/faq" className="font-medium text-ink underline underline-offset-4">
            FAQ page
          </Link>
          , call{' '}
          {siteConfig.contact.salesPhones.map((p, i) => (
            <span key={p.tel}>
              {i > 0 ? ' or ' : ''}
              <a href={`tel:${p.tel}`} className="underline">
                {p.display}
              </a>
            </span>
          ))}{' '}
          , or email{' '}
          <a href={`mailto:${siteConfig.contact.salesEmail}`} className="underline">
            {siteConfig.contact.salesEmail}
          </a>
          .
            </>
          )}
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
