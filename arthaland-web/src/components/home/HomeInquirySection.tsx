import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { InquiryForm } from '../forms/InquiryForm'
import { sectionImages } from '../../config/sectionImages'
import { usePageSection } from '../../contexts/PageContentContext'

export function HomeInquirySection() {
  const copy = usePageSection('inquiry')
  const sideImage = copy.imageUrl ?? sectionImages.inquirySide
  return (
    <section className="bg-surface-soft py-20 md:py-28" id="inquiry">
      <Container className="section-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>{copy.eyebrow ?? 'Inquiry'}</Eyebrow>
          <h2 className="text-heading-2 mt-4 max-w-[16ch]">
            {copy.title ?? "Let's Find Your Next Home."}
          </h2>
          <p className="mt-6 max-w-md text-title-muted whitespace-pre-line">
            {copy.body ??
              'Connect with our team to explore properties, request information, or arrange a viewing. Supervised by Mr. Gary Lee · Apex Technology.'}
          </p>
          <div className="mt-10 hidden aspect-[4/3] overflow-hidden lg:block">
            <img
              src={sideImage}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <InquiryForm source="homepage" />
      </Container>
    </section>
  )
}
