import { Link } from 'react-router-dom'
import { Container } from '../../components/ui/Container'

const modules = [
  { label: 'All developments', href: '/admin/developments' },
  { label: 'Inquiry inbox', href: '/admin', note: 'Supabase table ready' },
  { label: 'Site copy & SEO', href: '/admin', note: 'Planned' },
  { label: 'Team profiles', href: '/admin', note: 'Planned' },
]

export function AdminDashboardPage() {
  return (
    <div className="min-h-svh bg-surface-soft">
      <header className="border-b border-border bg-surface px-6 py-4">
        <Container className="flex items-center justify-between">
          <span className="text-nav font-medium">ARTHALAND CMS</span>
          <Link to="/" className="text-sm text-title-muted hover:text-ink">
            View site
          </Link>
        </Container>
      </header>
      <Container className="section-x py-12">
        <h1 className="text-heading-3">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-title-muted">
          Preview administration shell. Local seed data powers the public site;
          Supabase migration is documented in{' '}
          <code className="text-sm">docs/SUPABASE_CMS_PROPOSAL.md</code>. Admin
          routes are not authenticated yet — do not expose publicly without auth.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {modules.map((m) => (
            <li key={m.label}>
              <Link
                to={m.href}
                className="block border border-border bg-surface p-4 text-sm transition-colors hover:border-ink/30"
              >
                <span className="font-medium">{m.label}</span>
                {m.note && (
                  <span className="mt-1 block text-title-muted">{m.note}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  )
}
