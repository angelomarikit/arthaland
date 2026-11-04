import { siteConfig } from '../../config/site'

type LogoMarkProps = {
  className?: string
  /** When true, renders dark mark (for light headers). Default: white mark for hero/video. */
  inverted?: boolean
}

/** Official ARTHALAND ring mark (transparent PNG). */
export function LogoMark({ className = '', inverted = false }: LogoMarkProps) {
  const src = siteConfig.brand.logoMarkSrc ?? '/assets/brand/arthaland-mark.png'

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={120}
      height={120}
      decoding="async"
      className={`object-contain ${inverted ? 'invert' : ''} ${className}`}
    />
  )
}
