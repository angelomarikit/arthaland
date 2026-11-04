import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { FacebookIcon } from '../icons/FacebookIcon'
import { siteConfig } from '../../config/site'
import { gsap } from '../../animation/gsapSetup'
import { prefersReducedMotion } from '../../animation/prefersReducedMotion'

type MobileNavOverlayProps = {
  open: boolean
  onClose: () => void
}

const mainLinks = siteConfig.nav.pagesMenu

export function MobileNavOverlay({ open, onClose }: MobileNavOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open || prefersReducedMotion() || !panelRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-nav-item]', {
        y: 24,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power3.out',
      })
    }, panelRef)
    return () => ctx.revert()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="absolute inset-y-0 right-0 flex w-[min(100%,420px)] flex-col bg-surface shadow-2xl"
      >
        <div className="flex h-[82px] items-center justify-between border-b border-border px-6">
          <span className="text-nav font-medium">{siteConfig.brand.name}</span>
          <button
            type="button"
            className="flex size-11 items-center justify-center border border-border"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
          {mainLinks.map((item) => (
            <Link
              key={item.href}
              data-nav-item
              to={item.href}
              className="text-heading-3 border-b border-border py-4 uppercase tracking-[0.06em]"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <a
            data-nav-item
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nav mt-6 inline-flex items-center gap-2 text-title-muted hover:text-ink"
          >
            <FacebookIcon className="size-5" />
            ARTHALAND on Facebook
          </a>
        </nav>

        <div className="border-t border-border p-6">
          <Link
            to={siteConfig.nav.cta.href}
            className="text-button flex min-h-[52px] items-center justify-center border border-ink bg-ink uppercase tracking-[0.12em] text-surface transition-colors hover:bg-ink-soft"
            onClick={onClose}
          >
            {siteConfig.nav.cta.label}
          </Link>
        </div>
      </div>
    </div>
  )
}
