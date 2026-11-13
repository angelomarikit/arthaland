import { useMemo, useRef } from 'react'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { usePageSection } from '../../contexts/PageContentContext'
import type { GallerySectionContent } from '../../domain/home/types'
import { useHomeGalleryItems } from '../../hooks/useHomeGalleryItems'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import type { HomeGalleryItem } from '../../domain/home/types'

function galleryTileClass(item: HomeGalleryItem): string {
  const fit = item.imageObjectFit ?? 'natural'
  if (fit === 'cover') {
    return 'aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-[1.02]'
  }
  const base =
    'block w-full transition-transform duration-700 hover:scale-[1.01] bg-surface-muted/25'
  if (fit === 'contain') {
    return `${base} aspect-[3/4] object-contain`
  }
  return `${base} h-auto max-h-[min(92vh,960px)]`
}

export function ArchitecturalGallerySection() {
  const copy = usePageSection('gallery') as GallerySectionContent
  const items = useHomeGalleryItems()
  const ref = useRef<HTMLElement>(null)

  const columns = useMemo(() => {
    const cols: [typeof items, typeof items, typeof items] = [[], [], []]
    for (const item of items) {
      const col = Math.min(2, Math.max(0, item.column ?? 0))
      cols[col].push(item)
    }
    for (const col of cols) {
      col.sort((a, b) => a.displayOrder - b.displayOrder)
    }
    return cols
  }, [items])

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
    <section ref={ref} className="overflow-hidden bg-stage py-24 md:py-32" id="gallery">
      <Container className="section-x">
        <Eyebrow>{copy.eyebrow ?? 'Gallery'}</Eyebrow>
        <h2 className="text-heading-2 mt-4 max-w-[20ch]">
          {copy.title ?? 'Architectural rhythm across developments'}
        </h2>
        {copy.body && (
          <p className="mt-4 max-w-xl text-title-muted whitespace-pre-line">{copy.body}</p>
        )}
      </Container>

      <div className="section-x mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 lg:gap-8">
            {col.map((item) => (
              <figure key={item.id} data-gallery-item>
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className={galleryTileClass(item)}
                    style={
                      item.imageObjectPosition
                        ? { objectPosition: item.imageObjectPosition }
                        : undefined
                    }
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="text-eyebrow mt-3 text-title-muted">
                  {item.caption}
                  {item.category ? (
                    <span className="text-title-muted/80"> · {item.category}</span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
