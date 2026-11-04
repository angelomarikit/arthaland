import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { InquiryForm } from '../forms/InquiryForm'
import { sectionImages } from '../../config/sectionImages'

export function HomeInquirySection() {
  return (
    <section className="bg-surface-soft py-20 md:py-28" id="inquiry">
      <Container className="section-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>Inquiry</Eyebrow>
          <h2 className="text-heading-2 mt-4 max-w-[16ch]">
            Let&apos;s Find Your Next Home.
          </h2>
          <p className="mt-6 max-w-md text-title-muted">
            Connect with our team to explore properties, request information, or
            arrange a viewing. Supervised by Mr. Gary Lee · Apex Technology.
          </p>
          <div className="mt-10 hidden aspect-[4/3] overflow-hidden lg:block">
            <img
              src={sectionImages.inquirySide}
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
