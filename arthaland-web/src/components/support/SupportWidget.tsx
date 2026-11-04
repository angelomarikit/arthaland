import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Phone, ChevronRight } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { faqItems } from '../../data/faqs'
import { FaqAccordion } from '../faq/FaqAccordion'
import { SupportWidgetForm } from './SupportWidgetForm'

type PanelTab = 'menu' | 'faq' | 'contact'

export function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<PanelTab>('menu')
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) setTab('menu')
  }, [open])

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ tab?: PanelTab }>).detail
      setOpen(true)
      setTab(detail?.tab ?? 'menu')
    }
    window.addEventListener('arthaland:open-support', onOpen)
    return () => window.removeEventListener('arthaland:open-support', onOpen)
  }, [])

  const previewFaqs = faqItems.slice(0, 4)

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8"
      data-support-widget
    >
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="flex max-h-[min(78vh,640px)] w-[min(calc(100vw-2.5rem),400px)] flex-col overflow-hidden border border-border bg-surface shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)] motion-safe:animate-fade-up"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border bg-surface-soft px-5 py-4">
            <div>
              <p id={titleId} className="text-nav text-title-muted">
                Customer service
              </p>
              <p className="mt-1 text-lg font-medium tracking-[-0.03em]">
                {tab === 'menu' && 'How can we help?'}
                {tab === 'faq' && 'Common questions'}
                {tab === 'contact' && 'Send a message'}
              </p>
            </div>
            <button
              type="button"
              className="flex size-10 shrink-0 items-center justify-center border border-border transition-colors hover:bg-surface"
              aria-label="Close help panel"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {tab === 'menu' && (
              <div className="space-y-3">
                <button
                  type="button"
                  className="btn-tile flex w-full items-center justify-between px-4 py-4 text-left"
                  onClick={() => setTab('faq')}
                >
                  <span>
                    <span className="block font-medium">Browse FAQ</span>
                    <span className="mt-1 block text-sm text-title-muted">
                      Quick answers about developments & inquiries
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-title-muted" />
                </button>
                <button
                  type="button"
                  className="btn-tile flex w-full items-center justify-between px-4 py-4 text-left"
                  onClick={() => setTab('contact')}
                >
                  <span>
                    <span className="block font-medium">Contact sales team</span>
                    <span className="mt-1 block text-sm text-title-muted">
                      Send a message without leaving the page
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-title-muted" />
                </button>
                {siteConfig.contact.salesPhones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    className="btn-tile flex items-center gap-3 px-4 py-4"
                  >
                    <Phone className="size-5 shrink-0" aria-hidden />
                    <span>
                      <span className="block text-sm text-title-muted">Call sales</span>
                      <span className="font-medium">{p.display}</span>
                    </span>
                  </a>
                ))}
                <a
                  href={`mailto:${siteConfig.contact.salesEmail}`}
                  className="btn-tile flex items-center gap-3 px-4 py-4"
                >
                  <span className="text-sm text-title-muted">Email</span>
                  <span className="font-medium">{siteConfig.contact.salesEmail}</span>
                </a>
                <Link
                  to="/contact"
                  className="block text-center text-sm font-medium underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  Open full contact page
                </Link>
              </div>
            )}

            {tab === 'faq' && (
              <div>
                <FaqAccordion items={previewFaqs} defaultOpenIndex={-1} />
                <Link
                  to="/faq"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
                  onClick={() => setOpen(false)}
                >
                  View all FAQ
                  <ChevronRight className="size-4" />
                </Link>
                <button
                  type="button"
                  className="mt-4 block text-sm text-title-muted underline"
                  onClick={() => setTab('menu')}
                >
                  Back
                </button>
              </div>
            )}

            {tab === 'contact' && (
              <div>
                <SupportWidgetForm />
                <button
                  type="button"
                  className="mt-4 text-sm text-title-muted underline"
                  onClick={() => setTab('menu')}
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="text-button flex items-center gap-2.5 border border-ink bg-ink px-6 py-3.5 text-surface shadow-lg transition-colors duration-300 motion-safe:hover:-translate-y-px hover:border-ink-soft hover:bg-ink-soft motion-safe:active:scale-[0.98] motion-reduce:hover:translate-y-0"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <>
            <X className="size-5" aria-hidden />
            <span className="text-button hidden sm:inline">Close</span>
          </>
        ) : (
          <>
            <MessageCircle className="size-5" aria-hidden />
            <span className="text-button">Help</span>
          </>
        )}
      </button>
    </div>
  )
}
