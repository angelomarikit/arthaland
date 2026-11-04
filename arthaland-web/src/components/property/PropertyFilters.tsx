import type {
  AvailabilityStatus,
  DevelopmentCategory,
} from '../../domain/development/types'

export type PropertySort = 'featured' | 'name'

type PropertyFiltersProps = {
  query: string
  onQueryChange: (value: string) => void
  region: string
  onRegionChange: (value: string) => void
  category: DevelopmentCategory | ''
  onCategoryChange: (value: DevelopmentCategory | '') => void
  status: AvailabilityStatus | ''
  onStatusChange: (value: AvailabilityStatus | '') => void
  sort: PropertySort
  onSortChange: (value: PropertySort) => void
  regions: string[]
}

const fieldClass =
  'min-h-[52px] w-full border border-border bg-surface px-4 text-base transition-colors outline-none focus:border-ink'

export function PropertyFilters({
  query,
  onQueryChange,
  region,
  onRegionChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  regions,
}: PropertyFiltersProps) {
  return (
    <div className="border border-border bg-surface-soft p-5 md:p-8">
      <p className="text-nav mb-4 text-title-muted">Refine your search</p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <input
          type="search"
          placeholder="Search by name or location"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className={`${fieldClass} xl:col-span-2`}
          aria-label="Search developments"
        />
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as DevelopmentCategory | '')
          }
          className={fieldClass}
          aria-label="Category"
        >
          <option value="">All</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="mixed-use">Mixed-Use</option>
        </select>
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className={fieldClass}
          aria-label="Location"
        >
          <option value="">All locations</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as AvailabilityStatus | '')}
          className={fieldClass}
          aria-label="Availability"
        >
          <option value="">All status</option>
          <option value="Pre-Selling">Pre-Selling</option>
          <option value="Under Construction">Under Construction</option>
          <option value="Completed">Completed</option>
          <option value="Inquire for Availability">Inquire for Availability</option>
        </select>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as PropertySort)}
          className={fieldClass}
          aria-label="Sort"
        >
          <option value="featured">Featured first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
  )
}
