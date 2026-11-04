import { siteConfig } from '../../config/site'

type SiteLogoProps = {
  /** White lockup on dark hero; dark lockup on light bar */
  inverted?: boolean
  className?: string
}

/** Official ARTHALAND lockup (green removed, transparent PNG). */
export function SiteLogo({ inverted = false, className = '' }: SiteLogoProps) {
  const src =
    siteConfig.brand.logoLockupSrc ?? '/assets/brand/arthaland-logo-lockup.png'

  return (
    <img
      src={src}
      alt="ARTHALAND"
      width={280}
      height={120}
      decoding="async"
      className={`block h-11 w-auto max-w-[min(52vw,220px)] object-contain object-left md:h-12 md:max-w-[240px] ${inverted ? 'invert' : ''} ${className}`}
    />
  )
}
