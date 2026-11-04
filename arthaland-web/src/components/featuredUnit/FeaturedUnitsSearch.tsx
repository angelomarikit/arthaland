import { Search } from 'lucide-react'

type FeaturedUnitsSearchProps = {
  query: string
  onQueryChange: (value: string) => void
  development: string
  onDevelopmentChange: (value: string) => void
  developments: string[]
  resultCount: number
  totalCount: number
}

const fieldClass =
  'min-h-[52px] w-full border border-border bg-surface px-4 text-base transition-colors outline-none focus:border-ink'

export function FeaturedUnitsSearch({
  query,
  onQueryChange,
  development,
  onDevelopmentChange,
  developments,
  resultCount,
  totalCount,
}: FeaturedUnitsSearchProps) {
  return (
    <div className="mb-10 border border-border bg-surface-soft p-5 md:p-8">
      <p className="text-nav-primary mb-4 text-title-muted">Search listings</p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <label className="relative md:col-span-2 lg:col-span-2">
          <span className="sr-only">Search featured units</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-title-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by development, location, unit type, or price"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={`${fieldClass} pl-11`}
          />
        </label>
        <select
          value={development}
          onChange={(e) => onDevelopmentChange(e.target.value)}
          className={fieldClass}
          aria-label="Filter by development"
        >
          <option value="">All developments</option>
          {developments.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-4 text-sm text-title-muted">
        {resultCount === totalCount
          ? `${totalCount} listing${totalCount === 1 ? '' : 's'}`
          : `${resultCount} of ${totalCount} listings match your search`}
      </p>
    </div>
  )
}
