import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { FaqItem } from '../../data/faqs'

type FaqAccordionProps = {
  items: FaqItem[]
  /** Allow only one open at a time */
  singleOpen?: boolean
  defaultOpenIndex?: number
  className?: string
}

export function FaqAccordion({
  items,
  singleOpen = true,
  defaultOpenIndex = 0,
  className = '',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex)

  return (
    <div className={`divide-y divide-border ${className}`}>
      {items.map((faq, index) => {
        const open = openIndex === index
        return (
          <div key={faq.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left md:py-6"
              onClick={() => {
                if (singleOpen) setOpenIndex(open ? -1 : index)
                else setOpenIndex(open ? -1 : index)
              }}
              aria-expanded={open}
            >
              <span className="text-base font-medium tracking-[-0.02em] md:text-lg">
                {faq.q}
              </span>
              {open ? (
                <Minus className="size-5 shrink-0" aria-hidden />
              ) : (
                <Plus className="size-5 shrink-0" aria-hidden />
              )}
            </button>
            {open && (
              <p className="pb-5 text-sm leading-relaxed text-title-muted md:pb-6 md:text-base">
                {faq.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
