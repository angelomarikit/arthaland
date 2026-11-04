import { useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { sectionImages } from '../../config/sectionImages'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const columns = [
  [
    { src: sectionImages.gallery.col1a, cap: 'Lucima · Facade' },
    { src: sectionImages.gallery.col1b, cap: 'Una · Laguna' },
  ],
  [
    { src: sectionImages.gallery.col2a, cap: 'Sondris' },
    { src: sectionImages.gallery.col2b, cap: 'Lucima · Aerial' },
  ],
  [
    { src: sectionImages.gallery.col3a, cap: 'Lucima · Suite' },
    { src: sectionImages.gallery.col3b, cap: 'Lucima · Exterior' },
  ],
]

export function ArchitecturalGallerySection() {
  const ref = useRef<HTMLElement>(null)

  useGsapScope(
    ref,
    () => {
      gsap.from('[data-gallery-item]', {
        y: 28,
        opacity: 0,
        duration: motionDuration.base,
        stagger: 0.08,
        ease: motionEase.editorial,
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
    },
    [],
  )

  return (
    <section ref={ref} className="overflow-hidden bg-stage py-24 md:py-32">
      <Container className="section-x">
        <Eyebrow>Gallery</Eyebrow>
        <h2 className="text-heading-2 mt-4 max-w-[20ch]">
          Architectural rhythm across developments
        </h2>
      </Container>

      <div className="section-x mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 lg:gap-8">
            {col.map((item) => (
              <figure key={item.src} data-gallery-item>
                <div className="overflow-hidden">
                  <img
                    src={item.src}
                    alt=""
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <figcaption className="text-eyebrow mt-3 text-title-muted">
                  {item.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
