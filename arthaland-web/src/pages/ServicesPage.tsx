import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { FadeInWhenVisible } from '../components/page/FadeInWhenVisible'
import { PageConsultCta } from '../components/page/PageConsultCta'
import { sectionImages } from '../config/sectionImages'
import { usePageSection } from '../contexts/PageContentContext'
import { titleToDisplayLines } from '../lib/cms/pageContentMerge'

const serviceSections = [
  {
    eyebrow: 'Consultation',
    title: 'Property consultation',
    body: 'Thoughtful guidance on ARTHALAND developments, sustainability features, and how each address may fit your lifestyle goals — grounded in verified corporate materials.',
    image: sectionImages.servicesConsultation,
    imageLeft: false,
  },
  {
    eyebrow: 'Discovery',
    title: 'Development discovery',
    body: 'Access brochures, certification summaries, and published timelines from official ARTHALAND sources so you can compare projects with clarity.',
    image: sectionImages.servicesDiscovery,
    imageLeft: true,
  },
  {
    eyebrow: 'Selection',
    title: 'Unit selection assistance',
    body: 'Support comparing published unit types and configurations where available. Availability and pricing are always confirmed with the sales team.',
    image: sectionImages.servicesUnits,
    imageLeft: false,
  },
  {
    eyebrow: 'Viewings',
    title: 'Property viewing coordination',
    body: 'Schedule show suites, model units, or site visits where offered — coordinated respectfully around your schedule.',
    image: sectionImages.servicesViewing,
    imageLeft: true,
  },
]

const processSteps = [
  { step: '01', title: 'Share your interest', body: 'Tell us which development or lifestyle priorities matter most.' },
  { step: '02', title: 'Review verified materials', body: 'We align on facts from arthaland.com and official brochures.' },
  { step: '03', title: 'Compare options', body: 'Explore unit types and timelines where published.' },
  { step: '04', title: 'Coordinate next steps', body: 'Viewings, follow-up, and orientation — subject to ARTHALAND terms and your advisors.' },
]

export function ServicesPage() {
  const hero = usePageSection('hero')
  const consultation = usePageSection('property-consultation')
  const discovery = usePageSection('development-discovery')
  const selection = usePageSection('unit-selection')
  const viewings = usePageSection('viewing-coordination')
  const processCopy = usePageSection('process')
  const heroLines = titleToDisplayLines(hero.title, [
    'Thoughtful Guidance,',
    'Every Step of the Way.',
  ])
  const cmsByBlock = [consultation, discovery, selection, viewings]

  return (
    <>
      <SiteHeader embedded />
      <section className="hero-under-header relative min-h-[58vh] overflow-hidden bg-ink text-surface md:min-h-[62vh]">
        <img
          src={sectionImages.servicesHero}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <Container className="section-x relative flex min-h-[58vh] flex-col justify-end pb-16 pt-32 md:min-h-[62vh] md:pb-20">
          <Eyebrow dark>{hero.eyebrow ?? 'Services'}</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[14ch] animate-fade-up">
            {heroLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-surface/80 animate-fade-up animation-delay-150 whitespace-pre-line">
            {hero.subtitle ??
              hero.body ??
              'How the ARTHALAND sales team supports buyers exploring verified developments — from first questions through viewing coordination.'}
          </p>
        </Container>
      </section>

      {serviceSections.map((block, index) => {
        const copy = cmsByBlock[index]!
        const imageSrc = copy.imageUrl ?? block.image
        return (
        <section
          key={block.title}
          className={`py-16 md:py-24 ${block.imageLeft ? 'bg-surface-soft' : ''}`}
        >
          <Container className="section-x grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <FadeInWhenVisible
              className={`lg:col-span-5 ${block.imageLeft ? 'lg:order-2' : ''}`}
            >
              <Eyebrow>{copy.eyebrow ?? block.eyebrow}</Eyebrow>
              <h2 className="text-heading-3 mt-4">{copy.title ?? block.title}</h2>
              <p className="mt-5 max-w-md leading-relaxed text-title-muted whitespace-pre-line">
                {copy.body ?? block.body}
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible
              className={`lg:col-span-7 ${block.imageLeft ? 'lg:order-1' : ''}`}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={imageSrc}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
            </FadeInWhenVisible>
          </Container>
        </section>
      )})}

      <section className="border-y border-border py-16 md:py-24">
        <Container className="section-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <FadeInWhenVisible className="lg:col-span-5">
              <Eyebrow>{processCopy.eyebrow ?? 'Process'}</Eyebrow>
              <h2 className="text-heading-3 mt-4">
                {processCopy.title ?? 'How we work together'}
              </h2>
              <p className="mt-5 text-title-muted whitespace-pre-line">
                {processCopy.body ??
                  'Orientation on next steps — always subject to final terms from ARTHALAND and your legal and financial advisors.'}
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible className="lg:col-span-7">
              <ol className="space-y-8">
                {processSteps.map((item) => (
                  <li
                    key={item.step}
                    className="grid gap-4 border-t border-border pt-8 md:grid-cols-[72px_1fr]"
                  >
                    <span className="text-display-m text-title-muted">{item.step}</span>
                    <div>
                      <h3 className="text-xl font-medium tracking-[-0.03em]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-title-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeInWhenVisible>
          </div>
          <FadeInWhenVisible className="mt-14">
            <div className="aspect-[21/9] max-h-[320px] overflow-hidden">
              <img
                src={sectionImages.servicesProcess}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeInWhenVisible>
        </Container>
      </section>

      <PageConsultCta
        eyebrow="Client inquiries"
        title="Comfortable, responsive follow-up"
        body="Questions submitted through this site receive dedicated attention from the sales team — without overpromising services beyond ARTHALAND’s published scope."
      />
    </>
  )
}
