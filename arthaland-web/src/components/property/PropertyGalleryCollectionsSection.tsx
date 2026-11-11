import { useMemo, useState } from 'react'
import type { GalleryCollection } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'
import { PropertyGallery } from './PropertyGallery'

type PropertyGalleryCollectionsSectionProps = {
  developmentName: string
  collections: GalleryCollection[]
  legacyGallery: string[]
}

export function PropertyGalleryCollectionsSection({
  developmentName,
  collections,
  legacyGallery,
}: PropertyGalleryCollectionsSectionProps) {
  const [activeId, setActiveId] = useState(collections[0]?.id ?? 'legacy')

  const activeImages = useMemo(() => {
    if (collections.length === 0) return legacyGallery
    const coll = collections.find((c) => c.id === activeId)
    if (coll) return coll.images.map((i) => i.url)
    return legacyGallery
  }, [activeId, collections, legacyGallery])

  return (
    <section
      className="border-y border-border bg-surface-soft py-16 md:py-24"
      id="gallery"
    >
      <Container className="section-x">
        <FadeInWhenVisible>
          <Eyebrow>Gallery</Eyebrow>
          <h2 className="text-heading-3 mt-4">Architecture & environment</h2>
          {collections.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {collections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    activeId === c.id
                      ? 'border-ink bg-ink text-surface'
                      : 'border-border text-title-muted'
                  }`}
                >
                  {c.title}
                </button>
              ))}
              {legacyGallery.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveId('legacy')}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    activeId === 'legacy'
                      ? 'border-ink bg-ink text-surface'
                      : 'border-border text-title-muted'
                  }`}
                >
                  More
                </button>
              )}
            </div>
          )}
          <div className="mt-10">
            {activeImages.length > 0 ? (
              <PropertyGallery images={activeImages} developmentName={developmentName} />
            ) : (
              <p className="text-title-muted">Content will be published when available.</p>
            )}
          </div>
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
