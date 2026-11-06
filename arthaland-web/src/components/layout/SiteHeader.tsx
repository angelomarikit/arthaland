import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { FacebookIcon } from '../icons/FacebookIcon'
import { siteConfig } from '../../config/site'
import { SiteLogo } from '../brand/SiteLogo'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { MobileNavOverlay } from './MobileNavOverlay'
import { PropertiesNavMenu } from './PropertiesNavMenu'

type SiteHeaderProps = {
  embedded?: boolean
}

export function SiteHeader({ embedded = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { nav } = siteConfig
  const location = useLocation()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={`sticky top-0 z-30 h-[var(--site-header-h)] border-b border-border bg-surface transition-shadow duration-500 ${
          scrolled || !embedded ? 'shadow-sm' : 'shadow-none'
        }`}
      >
        <Container className="flex h-full items-center justify-between gap-4 px-6 md:px-8">
          <Link to="/" className="flex min-w-0 shrink-0 items-center">
            <SiteLogo />
          </Link>

          <nav
            className="hidden items-center gap-6 text-ink xl:gap-8 lg:flex"
            aria-label="Primary"
          >
            {nav.primary.map((item) => {
              if (item.href === '/properties') {
                return <PropertiesNavMenu key={item.href} />
              }
              const active = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-nav-primary text-ink transition-opacity hover:opacity-70 ${active ? 'underline underline-offset-8' : ''}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink transition-opacity hover:opacity-70"
              aria-label="ARTHALAND on Facebook"
            >
              <FacebookIcon className="size-5" />
            </a>
            <Button
              href={nav.cta.href}
              variant="default"
              size="compact"
              className="uppercase tracking-[0.12em]"
            >
              {nav.cta.label}
            </Button>
          </nav>

          <button
            type="button"
            className="flex size-11 items-center justify-center border border-border text-ink lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </Container>
      </header>

      <MobileNavOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
