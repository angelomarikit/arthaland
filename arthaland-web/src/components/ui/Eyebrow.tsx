type EyebrowProps = {
  children: string
  className?: string
  dark?: boolean
}

export function Eyebrow({ children, className = '', dark = false }: EyebrowProps) {
  return (
    <p
      className={`text-eyebrow flex items-center gap-2 uppercase ${dark ? 'text-[#bababa]' : 'text-title-muted'} ${className}`.trim()}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${dark ? 'bg-accent' : 'bg-ink'}`}
        aria-hidden
      />
      {children}
    </p>
  )
}
