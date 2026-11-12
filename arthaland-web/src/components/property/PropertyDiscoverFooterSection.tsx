import type { Development } from '../../domain/development/types'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/Eyebrow'
import { FadeInWhenVisible } from '../page/FadeInWhenVisible'
import { PropertyCard } from './PropertyCard'
import { PropertyFeaturedVerticalCard } from './PropertyFeaturedVerticalCard'

type PropertyDiscoverFooterSectionProps = {
  currentSlug: string
  portfolioList: Development[]
  relatedList: Development[]
}

const MAX_FEATURED = 5

export function PropertyDiscoverFooterSection({
  currentSlug,
  portfolioList,
  relatedList,
}: PropertyDiscoverFooterSectionProps) {
  const featuredList = portfolioList
    .filter(
      (d) =>
        d.slug !== currentSlug &&
        d.featured &&
        d.publicationStatus === 'published',
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, MAX_FEATURED)

  if (relatedList.length === 0 && featuredList.length === 0) return null

  return (
    <section className="border-t border-border py-16 md:py-24">
      <Container className="section-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {relatedList.length > 0 && (
            <FadeInWhenVisible className={featuredList.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}>
              <Eyebrow>Discover more</Eyebrow>
              <h2 className="text-heading-3 mt-4">Related developments</h2>
              <div className="mt-10 grid gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {relatedList.map((d) => (
                  <PropertyCard key={d.slug} development={d} />
                ))}
              </div>
            </FadeInWhenVisible>
          )}

          {featuredList.length > 0 && (
            <aside
              className={
                relatedList.length > 0
                  ? 'lg:col-span-4 lg:border-l lg:border-border lg:pl-10'
                  : 'lg:col-span-12 lg:max-w-md'
              }
            >
              <FadeInWhenVisible>
                <Eyebrow>Portfolio</Eyebrow>
                <h2 className="text-heading-3 mt-4">Featured properties</h2>
                <p className="mt-2 text-sm text-title-muted">
                  Curated highlights from the ARTHALAND portfolio.
                </p>
                <ul className="mt-8 flex flex-col gap-4">
                  {featuredList.map((d) => (
                    <li key={d.slug}>
                      <PropertyFeaturedVerticalCard development={d} />
                    </li>
                  ))}
                </ul>
              </FadeInWhenVisible>
            </aside>
          )}
        </div>
      </Container>
    </section>
  )
}
