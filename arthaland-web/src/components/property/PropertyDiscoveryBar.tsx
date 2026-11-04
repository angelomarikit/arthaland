import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

export function PropertyDiscoveryBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/properties?q=${encodeURIComponent(q)}` : '/properties')
  }

  return (
    <section className="border-b border-border bg-surface">
      <Container className="section-x py-10 md:py-14">
        <p className="text-eyebrow text-title-muted">Find a development</p>
        <form
          onSubmit={onSubmit}
          className="mt-4 flex flex-col gap-3 md:flex-row md:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-title-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location"
              className="min-h-[52px] w-full border border-border bg-surface pl-12 pr-4 outline-none focus:border-ink"
              aria-label="Search developments"
            />
          </div>
          <Button type="submit" className="min-h-[52px] shrink-0">
            Explore Properties
          </Button>
        </form>
      </Container>
    </section>
  )
}
