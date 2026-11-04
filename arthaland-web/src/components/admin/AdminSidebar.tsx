import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ExternalLink, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { adminNavGroups, propertySubLinks } from './adminNavConfig'

const EXPANDED_KEY = 'arthaland-cms-nav-expanded'

function loadExpanded(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(EXPANDED_KEY)
    if (!raw) return { overview: true, properties: true, website: true }
    return JSON.parse(raw) as Record<string, boolean>
  } catch {
    return { overview: true, properties: true, website: true }
  }
}

type AdminSidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [expanded, setExpanded] = useState(loadExpanded)

  const propertyMatch = location.pathname.match(/^\/admin\/properties\/([^/]+)/)
  const activePropertySlug = propertyMatch?.[1]

  useEffect(() => {
    localStorage.setItem(EXPANDED_KEY, JSON.stringify(expanded))
  }, [expanded])

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const navBody = (
    <>
      <div className="border-b border-border px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-title-muted">
          ARTHALAND
        </p>
        <p className="mt-1 text-lg font-medium tracking-tight text-ink">CMS</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {adminNavGroups.map((group) => {
          const open = expanded[group.id] !== false
          return (
            <div key={group.id} className="mb-4">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-title-muted hover:bg-surface-soft"
                onClick={() => toggle(group.id)}
                aria-expanded={open}
              >
                {group.label}
                <ChevronDown
                  className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <ul className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active =
                      item.href === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={onMobileClose}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                            active
                              ? 'bg-ink text-surface'
                              : 'text-ink hover:bg-surface-soft'
                          }`}
                        >
                          {Icon && <Icon className="size-4 shrink-0 opacity-80" />}
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}

        {activePropertySlug && (
          <div className="mb-4 border-t border-border pt-4">
            <p className="px-2 text-xs font-medium uppercase tracking-wider text-title-muted">
              Property
            </p>
            <ul className="mt-2 max-h-64 space-y-0.5 overflow-y-auto">
              {propertySubLinks(activePropertySlug).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onMobileClose}
                    className={`block rounded-lg px-3 py-2 text-xs ${
                      location.pathname === link.href
                        ? 'bg-surface-soft font-medium text-ink'
                        : 'text-title-muted hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-title-muted hover:bg-surface-soft hover:text-ink"
        >
          <ExternalLink className="size-4" />
          View website
        </Link>
        <p className="mt-3 truncate px-3 text-xs text-title-muted">{user?.email}</p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-surface-soft"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
        {navBody}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,280px)] flex-col bg-surface shadow-xl">
            {navBody}
          </aside>
        </div>
      )}
    </>
  )
}
