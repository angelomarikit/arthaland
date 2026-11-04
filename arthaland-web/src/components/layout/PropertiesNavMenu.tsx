import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { getPortfolioDevelopments } from '../../data/repositories/developmentRepository'

type PropertiesNavMenuProps = {
  onHero: boolean
}

export function PropertiesNavMenu({ onHero }: PropertiesNavMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const developments = getPortfolioDevelopments()
  const residential = developments.filter((d) => d.category === 'residential')
  const commercial = developments.filter((d) => d.category === 'commercial')
  const mixed = developments.filter((d) => d.category === 'mixed-use')
  const active = location.pathname.startsWith('/properties')
  const linkClass = onHero
    ? 'text-surface hover:opacity-70'
    : 'text-ink hover:opacity-70'

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        className={`text-nav inline-flex items-center gap-1 transition-opacity ${linkClass} ${active ? 'underline underline-offset-8' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Properties
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 mt-3 w-[min(92vw,520px)] border border-border bg-surface p-6 shadow-xl">
          <Link
            to="/properties"
            className="text-sm font-medium underline underline-offset-4"
          >
            View all properties
          </Link>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {residential.length > 0 && (
              <div>
                <p className="text-nav text-title-muted">Residential</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {residential.map((d) => (
                    <li key={d.slug}>
                      <Link to={`/properties/${d.slug}`} className="hover:underline">
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {commercial.length > 0 && (
              <div>
                <p className="text-nav text-title-muted">Commercial</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {commercial.map((d) => (
                    <li key={d.slug}>
                      <Link to={`/properties/${d.slug}`} className="hover:underline">
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {mixed.length > 0 && (
              <div>
                <p className="text-nav text-title-muted">Mixed-Use</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {mixed.map((d) => (
                    <li key={d.slug}>
                      <Link to={`/properties/${d.slug}`} className="hover:underline">
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
