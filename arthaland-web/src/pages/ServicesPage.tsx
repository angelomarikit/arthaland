import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

const services = [
  {
    title: 'Property consultation',
    body: 'Guidance on ARTHALAND developments, sustainability features, and fit for your lifestyle goals.',
  },
  {
    title: 'Development information',
    body: 'Verified materials from official ARTHALAND sources — brochures, certifications, and timelines.',
  },
  {
    title: 'Unit selection assistance',
    body: 'Support comparing unit types where published; availability confirmed with the sales team.',
  },
  {
    title: 'Property viewing coordination',
    body: 'Schedule show suites, model units, or site visits where available.',
  },
  {
    title: 'Buying process guidance',
    body: 'Orientation on next steps — subject to final terms from ARTHALAND and your advisors.',
  },
  {
    title: 'Client inquiry assistance',
    body: 'Dedicated follow-up for questions submitted through this website.',
  },
]

export function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <Container className="section-x py-24 md:py-32">
        <Eyebrow>Services</Eyebrow>
        <h1 className="text-heading-2 mt-4">How our sales team can help</h1>
        <p className="mt-4 max-w-2xl text-title-muted">
          Proposed service categories for the Gary Lee sales team channel. Final
          scope subject to ARTHALAND approval.
        </p>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {services.map((s) => (
            <div key={s.title} className="py-8 md:py-10">
              <h2 className="text-xl font-medium tracking-[-0.03em]">{s.title}</h2>
              <p className="mt-3 max-w-2xl text-title-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
