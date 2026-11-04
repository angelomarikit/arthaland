import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const faqs = [
  {
    q: 'Which developments can I explore here?',
    a: 'This site features verified ARTHALAND residential developments such as Eluria, Una Apartments, Lucima, Liv, Sondris, and Sevina Park. See the Properties page for the full published catalog.',
  },
  {
    q: 'Are prices and units always available online?',
    a: 'We show pricing only when it is verified on arthaland.com. Otherwise you will see “Price Upon Request” or “Inquire for Availability.”',
  },
  {
    q: 'How do I request a viewing?',
    a: 'Use the Contact page or the inquiry form on a property detail page. Our sales team supervised by Mr. Gary Lee will coordinate next steps.',
  },
  {
    q: 'Is this the official ARTHALAND corporate website?',
    a: 'No. This is a dedicated property sales team site developed by Apex Technology. Corporate information remains at arthaland.com.',
  },
  {
    q: 'What sustainability commitments does ARTHALAND highlight?',
    a: 'Public materials reference a net zero portfolio target by 2030 and certified sustainable development practices. Details vary by project.',
  },
  {
    q: 'Who supervises this sales team?',
    a: 'Mr. Gary Lee is identified as the sales team supervisor. Team profiles will expand as authorized photos and biographies are supplied.',
  },
]

export function HomeFaqSection() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <section className="bg-surface-soft pb-24 pt-20 md:pb-[130px] md:pt-[120px]">
      <Container className="section-x">
        <Eyebrow>questions</Eyebrow>
        <h2 className="text-heading-2 mt-4">The things people ask us first</h2>
        <p className="mt-4 max-w-xl text-title-muted">
          If yours is not here, contact the sales team or call{' '}
          <a href="tel:+63284036910" className="underline">
            +63 2 8403 6910
          </a>{' '}
          (ARTHALAND corporate office, per arthaland.com).
        </p>
        <div className="mt-12 divide-y divide-border">
          {faqs.map((faq, index) => {
            const open = openFaq === index
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  aria-expanded={open}
                >
                  <span className="text-lg font-medium">{faq.q}</span>
                  {open ? (
                    <Minus className="size-5 shrink-0" />
                  ) : (
                    <Plus className="size-5 shrink-0" />
                  )}
                </button>
                {open && <p className="pb-6 text-title-muted">{faq.a}</p>}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
