type ParallaxImageProps = {
  src: string
  alt?: string
  className?: string
  /** @deprecated Parallax disabled for scroll performance; kept for API compatibility */
  speed?: number
}

/** Static architectural image — same layout, no scroll-linked motion. */
export function ParallaxImage({
  src,
  alt = '',
  className = '',
}: ParallaxImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="size-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
