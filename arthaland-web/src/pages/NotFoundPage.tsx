import { SiteHeader } from '../components/layout/SiteHeader'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'

export function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <Container className="section-x py-32 text-center md:py-40">
        <p className="text-display-m text-ink">404</p>
        <h1 className="text-heading-3 mt-4">Page not found</h1>
        <Button href="/" className="mt-8">
          Return home
        </Button>
      </Container>
    </>
  )
}
