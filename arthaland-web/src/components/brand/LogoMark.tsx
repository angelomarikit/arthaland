/** Avenlo-style mark placeholder until ARTHALAND logo is supplied. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 39 45"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <rect x="4" y="18" width="7" height="27" rx="2" />
      <rect x="16" y="10" width="7" height="35" rx="2" />
      <rect x="28" y="4" width="7" height="41" rx="2" />
    </svg>
  )
}
