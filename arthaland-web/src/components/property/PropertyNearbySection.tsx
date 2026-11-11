import { useMemo, useState } from 'react'
import type { NearbyPlace } from '../../domain/propertyDetail/types'
import { NEARBY_CATEGORY_LABEL } from '../../domain/propertyDetail/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'

type PropertyNearbySectionProps = {
  items: NearbyPlace[]
}

export function PropertyNearbySection({ items }: PropertyNearbySectionProps) {
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return [...set]
  }, [items])

  const [active, setActive] = useState<string>(categories[0] ?? 'all')

  if (items.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <Container className="section-x max-w-3xl">
          <Eyebrow>Neighborhood</Eyebrow>
          <h2 className="text-heading-3 mt-4">Nearby</h2>
          <p className="mt-4 text-title-muted">
            Content will be published when available.
          </p>
        </Container>
      </section>
    )
  }

  const filtered =
    active === 'all' ? items : items.filter((i) => i.category === active)

  return (
    <section className="py-16 md:py-24">
      <Container className="section-x">
        <FadeInWhenVisible>
          <Eyebrow>Neighborhood</Eyebrow>
          <h2 className="text-heading-3 mt-4">Nearby establishments</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive('all')}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                active === 'all'
                  ? 'border-ink bg-ink text-surface'
                  : 'border-border text-title-muted'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  active === cat
                    ? 'border-ink bg-ink text-surface'
                    : 'border-border text-title-muted'
                }`}
              >
                {NEARBY_CATEGORY_LABEL[cat]}
              </button>
            ))}
          </div>
          <ul className="mt-10 divide-y divide-border border border-border">
            {filtered.map((place) => (
              <li
                key={place.id}
                className="flex flex-wrap items-baseline justify-between gap-2 px-6 py-4"
              >
                <div>
                  <p className="font-medium">{place.name}</p>
                  {place.notes && (
                    <p className="mt-1 text-sm text-title-muted">{place.notes}</p>
                  )}
                </div>
                {place.distanceLabel && (
                  <span className="text-sm text-title-muted">{place.distanceLabel}</span>
                )}
              </li>
            ))}
          </ul>
        </FadeInWhenVisible>
      </Container>
    </section>
  )
}
