import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'default' | 'dark' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const corners = (
  <>
    <span className="pointer-events-none absolute left-0 top-0 size-[15px] border-l border-t border-ink/20" />
    <span className="pointer-events-none absolute right-0 top-0 size-[15px] border-r border-t border-ink/20" />
    <span className="pointer-events-none absolute bottom-0 left-0 size-[15px] border-b border-l border-ink/20" />
    <span className="pointer-events-none absolute bottom-0 right-0 size-[15px] border-b border-r border-ink/20" />
  </>
)

export function Button({
  children,
  href,
  onClick,
  variant = 'default',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base =
    'text-button relative inline-flex items-center justify-center px-[43px] py-[25px] transition-colors duration-300'

  const variants = {
    default:
      'bg-surface-alt text-ink hover:bg-ink hover:text-surface',
    dark: 'bg-ink text-surface hover:bg-ink-soft',
    ghost: 'bg-transparent text-ink hover:bg-surface-alt',
  }

  const classes = `${base} ${variants[variant]} ${className}`.trim()

  if (href?.startsWith('/')) {
    return (
      <Link to={href} className={classes}>
        {corners}
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {corners}
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {corners}
      {children}
    </button>
  )
}
