import { SiteHeader } from '../components/layout/SiteHeader'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

export function TeamPage() {
  return (
    <>
      <SiteHeader />
      <Container className="section-x py-24 md:py-32">
        <Eyebrow>Our team</Eyebrow>
        <h1 className="text-heading-2 mt-4">Sales leadership</h1>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:max-w-4xl">
          <article className="border border-border p-8">
            <div className="flex aspect-square max-w-[200px] items-center justify-center bg-surface-muted text-sm text-title-muted">
              Photo pending
            </div>
            <h2 className="text-heading-3 mt-6">Mr. Gary Lee</h2>
            <p className="text-nav mt-1 text-title-muted">Sales Team Supervisor</p>
            <p className="mt-4 text-sm text-title-muted">
              Biography and contact details will be published when supplied. CMS
              fields: name, role, photo, bio, email, phone, assigned developments.
            </p>
          </article>
        </div>
      </Container>
    </>
  )
}
