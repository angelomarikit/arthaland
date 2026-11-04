import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type PropertyGalleryProps = {
  images: string[]
  developmentName: string
}

function uniqueImages(urls: string[]) {
  return [...new Set(urls.filter(Boolean))]
}

export function PropertyGallery({ images, developmentName }: PropertyGalleryProps) {
  const slides = useMemo(() => uniqueImages(images), [images])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + slides.length) % slides.length,
    )
  }, [slides.length])
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % slides.length))
  }, [slides.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxIndex, close, prev, next])

  if (slides.length === 0) {
    return (
      <div className="border border-border bg-surface-soft px-8 py-16 text-center">
        <p className="text-heading-3">Gallery</p>
        <p className="mx-auto mt-4 max-w-md text-title-muted">
          Additional photography for {developmentName} is available through the sales
          team and official ARTHALAND materials.
        </p>
      </div>
    )
  }

  if (slides.length === 1) {
    return (
      <div className="grid gap-6 lg:grid-cols-12">
        <button
          type="button"
          className="relative aspect-[16/10] overflow-hidden lg:col-span-8"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={slides[0]}
            alt=""
            className="size-full object-cover transition-opacity hover:opacity-95"
            loading="lazy"
          />
        </button>
        <div className="flex flex-col justify-center border border-border bg-surface-soft p-8 lg:col-span-4">
          <p className="text-eyebrow text-title-muted">Photography</p>
          <p className="mt-3 text-title-muted leading-relaxed">
            More verified imagery for this development can be shared during your
            consultation. Images shown are from authorized ARTHALAND sources.
          </p>
        </div>
      </div>
    )
  }

  const [hero, ...rest] = slides

  return (
    <>
      <div className="grid gap-3 md:grid-cols-12 md:gap-4">
        <button
          type="button"
          className="relative aspect-[16/10] overflow-hidden md:col-span-8 md:row-span-2 md:aspect-auto md:min-h-[420px]"
          onClick={() => setLightboxIndex(0)}
        >
          <img src={hero} alt="" className="size-full object-cover" loading="lazy" />
        </button>
        {rest.slice(0, 4).map((src, i) => (
          <button
            key={src}
            type="button"
            className="relative aspect-[4/3] overflow-hidden md:col-span-4"
            onClick={() => setLightboxIndex(i + 1)}
          >
            <img src={src} alt="" className="size-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal
          aria-label={`${developmentName} gallery`}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex size-11 items-center justify-center border border-surface/30 text-surface"
            onClick={close}
            aria-label="Close gallery"
          >
            <X className="size-5" />
          </button>
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-surface/30 text-surface md:left-8"
                onClick={prev}
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-surface/30 text-surface md:right-8"
                onClick={next}
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <img
            src={slides[lightboxIndex]}
            alt=""
            className="max-h-[85vh] max-w-[min(1200px,92vw)] object-contain"
          />
        </div>
      )}
    </>
  )
}
