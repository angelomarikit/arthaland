import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { FacebookIcon } from '../icons/FacebookIcon'
import { siteConfig } from '../../config/site'
import { LogoMark } from '../brand/LogoMark'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { MobileNavOverlay } from './MobileNavOverlay'

type SiteHeaderProps = {
  embedded?: boolean
}

export function SiteHeader({ embedded = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { brand, nav } = siteConfig
  const location = useLocation()
  const onHero = embedded && !scrolled

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
        className={
          embedded
            ? `absolute inset-x-0 top-0 z-30 transition-colors duration-500 ${scrolled ? 'bg-surface/95 shadow-sm backdrop-blur-md' : 'bg-gradient-to-b from-ink/40 to-transparent'}`
            : `sticky top-0 z-30 border-b transition-colors duration-500 ${scrolled ? 'border-border bg-surface/95 backdrop-blur-md' : 'border-transparent bg-surface'}`
        }
      >
        <Container className="flex h-[82px] items-center justify-between gap-4 px-6 md:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <LogoMark
              className="h-11 w-11 shrink-0 md:h-[45px] md:w-[45px]"
              inverted={!onHero}
            />
            <span className="flex min-w-0 flex-col gap-0.5 leading-none">
              <span
                className={`truncate text-[clamp(1.25rem,4vw,2rem)] font-bold tracking-[-0.05em] ${onHero ? 'text-surface' : 'text-ink'}`}
              >
                {brand.name}
              </span>
              <span
                className={`text-nav truncate text-[11px] uppercase tracking-[0.64px] ${onHero ? 'text-surface/70' : 'text-title-muted'}`}
              >
                {brand.tagline}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 xl:gap-8 lg:flex"
            aria-label="Primary"
          >
            {nav.primary.map((item) => {
              const active = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-nav transition-opacity hover:opacity-70 ${onHero ? 'text-surface' : 'text-ink'} ${active ? 'underline underline-offset-8' : ''}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-opacity hover:opacity-70 ${onHero ? 'text-surface' : 'text-ink'}`}
              aria-label="ARTHALAND on Facebook"
            >
              <FacebookIcon className="size-5" />
            </a>
            <Button
              href={nav.cta.href}
              className={
                onHero
                  ? 'border border-surface/40 bg-transparent px-8 py-4 text-surface hover:bg-surface hover:text-ink'
                  : 'px-8 py-4'
              }
            >
              {nav.cta.label}
            </Button>
          </nav>

          <button
            type="button"
            className={`flex size-11 items-center justify-center border lg:hidden ${onHero ? 'border-surface/40 text-surface' : 'border-border text-ink'}`}
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
