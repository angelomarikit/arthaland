import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'

type PlaceholderPageProps = {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <SiteHeader />
      <Container className="section-x py-32">
        <p className="text-eyebrow text-title-muted">Coming soon</p>
        <h1 className="text-heading-2 mt-4">{title}</h1>
        {description && (
          <p className="mt-4 max-w-xl text-title-muted">{description}</p>
        )}
      </Container>
    </>
  )
}
