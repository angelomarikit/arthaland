type ParallaxImageProps = {
  src: string
  alt?: string
  className?: string
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
  /** Show the full image at its natural aspect ratio (no fixed-height crop). */
  intrinsic?: boolean
  /** @deprecated Parallax disabled for scroll performance; kept for API compatibility */
  speed?: number
}

/** Static architectural image — same layout, no scroll-linked motion. */
export function ParallaxImage({
  src,
  alt = '',
  className = '',
  objectFit = 'cover',
  objectPosition = 'center center',
  intrinsic = false,
}: ParallaxImageProps) {
  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={
          intrinsic
            ? `w-full h-auto ${fitClass}`
            : `size-full ${fitClass}`
        }
        style={intrinsic ? undefined : { objectPosition }}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
