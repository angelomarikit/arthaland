import { useMemo, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../animation/gsapSetup'
import { motionDuration, motionEase } from '../../animation/motionTokens'
import { useGsapScope } from '../../animation/useGsapScope'
import { usePageSection } from '../../contexts/PageContentContext'
import type { GallerySectionContent, HomeGalleryItem } from '../../domain/home/types'
import { useHomeGalleryItems } from '../../hooks/useHomeGalleryItems'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'

const COLUMN_COUNT = 3

/** Spread tiles evenly across three masonry columns (1st → col 1, 2nd → col 2, …). */
function itemsInThreeColumns(items: HomeGalleryItem[]): HomeGalleryItem[][] {
  const sorted = [...items].sort(
    (a, b) => a.displayOrder - b.displayOrder || a.caption.localeCompare(b.caption),
  )
  const cols: HomeGalleryItem[][] = [[], [], []]
  sorted.forEach((item, index) => {
    cols[index % COLUMN_COUNT]!.push(item)
  })
  return cols
}

function isInternalHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//')
}

function GalleryLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  const shell =
    'group flex w-full min-w-0 cursor-pointer items-start justify-center overflow-hidden rounded-sm bg-surface-muted/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
  if (isInternalHref(href)) {
    return (
      <Link to={href} className={shell} aria-label={label}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className={shell}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  )
}

function GalleryTile({ item }: { item: HomeGalleryItem }) {
  const fit = item.imageObjectFit ?? 'contain'
  const href = item.href?.trim()

  const imgClass =
    fit === 'cover'
      ? 'aspect-[3/4] w-full object-cover'
      : fit === 'natural'
        ? 'h-auto w-full max-h-[min(88vh,900px)]'
        : 'w-full max-h-[min(52vh,620px)] object-contain object-top'

  const image = (
    <img
      src={item.imageUrl}
      alt={item.caption || 'Gallery image'}
      className={`block max-w-full transition-transform duration-700 group-hover:scale-[1.01] ${imgClass}`}
      style={item.imageObjectPosition ? { objectPosition: item.imageObjectPosition } : undefined}
      loading="lazy"
      decoding="async"
    />
  )

  if (href) {
    return (
      <GalleryLink href={href} label={item.caption || 'View project'}>
        {image}
      </GalleryLink>
    )
  }

  return (
    <div className="flex w-full min-w-0 items-start justify-center overflow-hidden rounded-sm bg-surface-muted/15">
      {image}
    </div>
  )
}

export function ArchitecturalGallerySection() {
  const copy = usePageSection('gallery') as GallerySectionContent
  const items = useHomeGalleryItems()
  const ref = useRef<HTMLElement>(null)

  const columns = useMemo(() => itemsInThreeColumns(items), [items])

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
    <section ref={ref} className="bg-stage py-24 md:py-32" id="gallery">
      <Container className="section-x">
        <Eyebrow>{copy.eyebrow ?? 'Gallery'}</Eyebrow>
        <h2 className="text-heading-2 mt-4 max-w-[20ch]">
          {copy.title ?? 'Architectural rhythm across developments'}
        </h2>
        {copy.body && (
          <p className="mt-4 max-w-xl text-title-muted whitespace-pre-line">{copy.body}</p>
        )}
      </Container>

      <div className="section-x mt-14">
        <div className="grid grid-cols-1 gap-8 min-[720px]:grid-cols-3 min-[720px]:gap-6 lg:gap-8">
          {columns.map((col, colIndex) => (
            <ul key={colIndex} className="flex min-w-0 flex-col gap-8 lg:gap-10">
              {col.map((item) => (
                <li key={item.id} data-gallery-item className="min-w-0">
                  <figure>
                    <GalleryTile item={item} />
                    <figcaption className="text-eyebrow mt-3 text-title-muted">
                      {item.href?.trim() ? (
                        isInternalHref(item.href.trim()) ? (
                          <Link to={item.href.trim()} className="underline-offset-2 hover:underline">
                            {item.caption}
                          </Link>
                        ) : (
                          <a
                            href={item.href.trim()}
                            className="underline-offset-2 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.caption}
                          </a>
                        )
                      ) : (
                        item.caption
                      )}
                      {item.category ? (
                        <span className="text-title-muted/80"> · {item.category}</span>
                      ) : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
