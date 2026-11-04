import { Mail, Phone } from 'lucide-react'
import { siteConfig } from '../../config/site'

type SalesContactBlockProps = {
  variant?: 'dark' | 'light'
}

/** Shared sales phone + email from site config */
export function SalesContactBlock({ variant = 'dark' }: SalesContactBlockProps) {
  const { salesEmail, salesPhones } = siteConfig.contact
  const muted = variant === 'dark' ? 'text-surface/55' : 'text-title-muted'
  const text = variant === 'dark' ? 'text-surface/90' : 'text-ink'
  const link = variant === 'dark' ? 'text-surface hover:opacity-80' : 'text-ink hover:opacity-70'
  const border = variant === 'dark' ? 'border-surface/15' : 'border-border'

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Phone className={`mt-0.5 size-5 shrink-0 ${variant === 'dark' ? 'text-surface/70' : 'text-title-muted'}`} aria-hidden />
        <div>
          <p className={`text-nav ${muted}`}>Sales mobile</p>
          <ul className="mt-2 space-y-1">
            {salesPhones.map((p) => (
              <li key={p.tel}>
                <a
                  href={`tel:${p.tel}`}
                  className={`block text-xl font-light tracking-[-0.03em] transition-opacity md:text-2xl ${link}`}
                >
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`flex gap-4 border-t pt-6 ${border}`}>
        <Mail className={`mt-0.5 size-5 shrink-0 ${variant === 'dark' ? 'text-surface/70' : 'text-title-muted'}`} aria-hidden />
        <div>
          <p className={`text-nav ${muted}`}>Email</p>
          <a
            href={`mailto:${salesEmail}`}
            className={`mt-2 block text-sm ${text} underline underline-offset-4 transition-opacity hover:opacity-80`}
          >
            {salesEmail}
          </a>
        </div>
      </div>
    </div>
  )
}

export function salesPhoneDisplayList(): string {
  return siteConfig.contact.salesPhones.map((p) => p.display).join(' or ')
}
