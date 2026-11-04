import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Grid2X2, X } from 'lucide-react'

type FeaturedUnitPhotoGalleryProps = {
  photos: string[]
  title: string
}

export function FeaturedUnitPhotoGallery({ photos, title }: FeaturedUnitPhotoGalleryProps) {
  const slides = useMemo(() => [...new Set(photos.filter(Boolean))], [photos])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + slides.length) % slides.length))
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length)
  }, [slides.length])
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % slides.length))
    setActiveIndex((i) => (i + 1) % slides.length)
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
      <div className="flex aspect-[16/10] items-center justify-center bg-surface-muted text-sm text-title-muted">
        Photos coming soon
      </div>
    )
  }

  const openAt = (index: number) => {
    setActiveIndex(index)
    setLightboxIndex(index)
  }

  const showAllOverlay = slides.length > 5

  return (
    <>
      {/* Mobile: hero + thumb strip */}
      <div className="md:hidden">
        <button
          type="button"
          className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted"
          onClick={() => openAt(activeIndex)}
        >
          <img
            src={slides[activeIndex]}
            alt=""
            className="size-full object-cover"
          />
          {slides.length > 1 && (
            <span className="text-button absolute bottom-4 right-4 flex items-center gap-2 border border-surface/30 bg-ink/75 px-3 py-1.5 text-surface backdrop-blur-sm">
              <Grid2X2 className="size-4" aria-hidden />
              {slides.length} photos
            </span>
          )}
        </button>
        {slides.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative size-16 shrink-0 overflow-hidden border-2 ${i === activeIndex ? 'border-ink' : 'border-transparent'}`}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Agoda-style bento */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-2 md:overflow-hidden md:rounded-sm">
        <button
          type="button"
          className="relative col-span-6 row-span-2 min-h-[420px] overflow-hidden bg-surface-muted lg:col-span-7"
          onClick={() => openAt(0)}
        >
          <img src={slides[0]} alt="" className="size-full object-cover transition-opacity hover:opacity-95" />
        </button>
        <div className="col-span-6 grid grid-cols-2 gap-2 lg:col-span-5">
          {slides.slice(1, 5).map((src, i) => {
            const index = i + 1
            const isLast = i === 3 && showAllOverlay
            return (
              <button
                key={src}
                type="button"
                className="relative aspect-[4/3] overflow-hidden bg-surface-muted"
                onClick={() => openAt(index)}
              >
                <img src={src} alt="" className="size-full object-cover transition-opacity hover:opacity-95" />
                {isLast && slides.length > 5 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm font-medium text-surface">
                    +{slides.length - 5} photos
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink/96"
          role="dialog"
          aria-modal
          aria-label={`${title} photos`}
        >
          <div className="flex items-center justify-between px-4 py-3 text-surface">
            <p className="text-sm">
              {lightboxIndex + 1} / {slides.length}
            </p>
            <button
              type="button"
              className="flex size-11 items-center justify-center border border-surface/30"
              onClick={close}
              aria-label="Close gallery"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-2 flex size-11 items-center justify-center border border-surface/30 text-surface md:left-6"
                  onClick={prev}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 flex size-11 items-center justify-center border border-surface/30 text-surface md:right-6"
                  onClick={next}
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
            <img
              src={slides[lightboxIndex]}
              alt=""
              className="max-h-[min(72vh,900px)] max-w-[min(1200px,94vw)] object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-4">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`size-14 shrink-0 overflow-hidden border-2 ${i === lightboxIndex ? 'border-surface' : 'border-surface/20 opacity-70'}`}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
