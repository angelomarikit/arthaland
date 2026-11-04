import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type ButtonVariant =
  | 'default'
  | 'dark'
  | 'ghost'
  | 'outline'
  | 'outlineOnDark'

type ButtonSize = 'default' | 'compact'

type ButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  /** Opens external URLs in a new tab with safe rel */
  external?: boolean
}

const sizes: Record<ButtonSize, string> = {
  default: 'px-8 py-4',
  compact: 'px-6 py-3.5',
}

const variants: Record<ButtonVariant, string> = {
  default:
    'border-border bg-surface-alt text-ink hover:border-ink hover:bg-ink hover:text-surface',
  dark: 'border-ink bg-ink text-surface hover:border-ink-soft hover:bg-ink-soft',
  ghost:
    'border-transparent bg-transparent text-ink hover:border-border hover:bg-surface-soft',
  outline:
    'border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-surface',
  outlineOnDark:
    'border-surface/40 bg-transparent text-surface hover:border-surface hover:bg-surface hover:text-ink',
}

export function Button({
  children,
  href,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  type = 'button',
  disabled = false,
  external = false,
}: ButtonProps) {
  const base =
    'text-button relative inline-flex items-center justify-center border transition-colors duration-300 motion-safe:hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0'

  const classes =
    `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()

  if (href?.startsWith('/')) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    const isExternal =
      external || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal && href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  )
}
