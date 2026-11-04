import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { FacebookIcon } from '../icons/FacebookIcon'
import { siteConfig } from '../../config/site'
import { Container } from '../ui/Container'

export function SiteFooter() {
  const { footer } = siteConfig

  return (
    <footer className="bg-ink text-surface">
      <Container className="section-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <p className="text-eyebrow mb-4 text-[#bababa]">get started</p>
          <p className="text-heading-3 mb-6 text-surface">
            Your next address starts here
          </p>
          <Link
            to="/contact"
            className="text-button inline-block border border-border-on-dark px-6 py-3 transition-colors hover:bg-surface hover:text-ink"
          >
            Get in Touch
          </Link>
        </div>
        <div>
          <p className="text-nav mb-4 text-[#bababa]">Main pages</p>
          <ul className="space-y-2 text-sm">
            {footer.mainPages.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  to={item.href}
                  className="text-[#bababa] transition-colors hover:text-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-nav mb-4 text-[#bababa]">Services</p>
          <ul className="space-y-2 text-sm">
            {footer.services.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="text-[#bababa] transition-colors hover:text-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-nav mb-4 text-[#bababa]">Office</p>
          {footer.office.lines.map((line) => (
            <p key={line} className="text-sm text-[#bababa]">
              {line}
            </p>
          ))}
          {footer.office.email ? (
            <p className="mt-4">
              <a
                href={`mailto:${footer.office.email}`}
                className="text-sm text-accent transition-opacity hover:opacity-80"
              >
                {footer.office.email}
              </a>
            </p>
          ) : null}
          <p className="mt-2">
            <a
              href={`tel:${footer.office.phone.replace(/\s/g, '')}`}
              className="text-sm text-[#bababa] hover:text-surface"
            >
              {footer.office.phone}
            </a>
          </p>
          <p className="mt-6">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#bababa] hover:text-surface"
            >
              <FacebookIcon className="size-4" />
              Facebook
            </a>
          </p>
        </div>
      </Container>
      <div className="border-t border-border-on-dark">
        <Container className="section-x flex h-[50px] items-center justify-between text-xs text-[#bababa]">
          <span>{footer.copyright}</span>
          <button
            type="button"
            className="flex items-center gap-1 hover:text-surface"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
            <ArrowUp className="size-3" />
          </button>
        </Container>
      </div>
    </footer>
  )
}
