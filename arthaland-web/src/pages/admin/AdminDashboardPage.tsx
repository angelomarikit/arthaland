import { Link } from 'react-router-dom'
import { Container } from '../../components/ui/Container'

const modules = [
  'Property CRUD & publish',
  'Development galleries (Storage)',
  'Inquiry inbox',
  'Hero media swap',
  'Site copy & SEO',
  'Team profiles',
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
        <p className="mt-2 text-title-muted">
          Protected routes and Supabase RLS policies are defined in{' '}
          <code>supabase/migrations/001_initial.sql</code>. Run the migration,
          then implement authenticated admin UI against{' '}
          <code>developments</code>, <code>inquiries</code>, and{' '}
          <code>site_content</code>.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {modules.map((m) => (
            <li key={m} className="border border-border bg-surface p-4 text-sm">
              {m}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  )
}
