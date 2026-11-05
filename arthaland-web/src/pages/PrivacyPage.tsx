import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'

export function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <Container className="section-x py-24 md:py-32">
        <h1 className="text-heading-2">Privacy</h1>
        <p className="mt-6 max-w-2xl text-title-muted">
          This sales-team site will publish ARTHALAND&apos;s privacy policy for
          inquiries submitted here. Until full policy copy is configured in the
          CMS, contact our sales team if you have questions about how your details
          are used.
        </p>
      </Container>
    </>
  )
}
