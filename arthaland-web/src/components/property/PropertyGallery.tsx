import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [slideIndex, setSlideIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  const close = useCallback(() => setLightboxIndex(null), [])
  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + slides.length) % slides.length,
    )
  }, [slides.length])
  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % slides.length))
  }, [slides.length])

  useEffect(() => {
    setSlideIndex((i) => (i < slides.length ? i : 0))
  }, [slides.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxIndex, close, lightboxPrev, lightboxNext])

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

  const currentSrc = slides[slideIndex]!

  return (
    <>
      <div className="border border-border bg-surface-soft">
        <div
          className="relative flex min-h-[min(56vw,420px)] items-center justify-center bg-surface-muted/40 md:min-h-[480px]"
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current
            const end = e.changedTouches[0]?.clientX
            touchStartX.current = null
            if (start == null || end == null || slides.length < 2) return
            const delta = end - start
            if (Math.abs(delta) < 40) return
            if (delta > 0) goPrev()
            else goNext()
          }}
        >
          <button
            type="button"
            className="group absolute inset-0 z-0 flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightboxIndex(slideIndex)}
            aria-label="View full size image"
          >
            <img
              src={currentSrc}
              alt=""
              className="max-h-[min(70vh,520px)] w-full max-w-full object-contain transition-opacity group-hover:opacity-95"
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-wider text-surface md:bottom-4 md:right-4">
              Tap to zoom
            </span>
          </button>

          {slides.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-border bg-surface/95 text-ink shadow-sm transition-colors hover:bg-surface md:left-4"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-border bg-surface/95 text-ink shadow-sm transition-colors hover:bg-surface md:right-4"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-title-muted md:px-5">
          <span>
            Image {slideIndex + 1} of {slides.length}
          </span>
          <span className="hidden sm:inline">Use arrows or swipe · click image to zoom</span>
        </div>

        {slides.length > 1 ? (
          <GalleryThumbRow
            slides={slides}
            activeIndex={slideIndex}
            onSelect={setSlideIndex}
          />
        ) : null}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal
          aria-label={`${developmentName} gallery`}
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center border border-surface/30 text-surface"
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
            aria-label="Close gallery"
          >
            <X className="size-5" />
          </button>
          {slides.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-surface/30 text-surface md:left-8"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxPrev()
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-surface/30 text-surface md:right-8"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxNext()
                }}
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <img
            src={slides[lightboxIndex]}
            alt=""
            className="max-h-[90vh] max-w-[min(1400px,96vw)] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

function GalleryThumbRow({
  slides,
  activeIndex,
  onSelect,
}: {
  slides: string[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="border-t border-border px-4 py-3 md:px-5">
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
        {slides.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`relative size-16 shrink-0 snap-start overflow-hidden border md:size-20 ${
              index === activeIndex ? 'border-ink ring-1 ring-ink' : 'border-border opacity-80'
            }`}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === activeIndex}
          >
            <img src={src} alt="" className="size-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}