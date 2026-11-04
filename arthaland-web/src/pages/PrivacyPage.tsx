import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'

export function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <Container className="section-x py-24 md:py-32">
        <h1 className="text-heading-2">Privacy</h1>
        <p className="mt-6 max-w-2xl text-title-muted">
          This sales-team site will adopt ARTHALAND&apos;s official privacy policy.
          Refer to{' '}
          <a
            href="https://arthaland.com/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            arthaland.com
          </a>{' '}
          for the corporate privacy statement until CMS content is configured.
        </p>
      </Container>
    </>
  )
}
