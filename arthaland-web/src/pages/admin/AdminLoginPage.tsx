import { Link } from 'react-router-dom'
import { Container } from '../../components/ui/Container'

export function AdminLoginPage() {
  return (
    <div className="min-h-svh bg-ink text-surface">
      <Container className="flex min-h-svh max-w-lg flex-col justify-center py-16">
        <h1 className="text-heading-3">Admin login</h1>
        <p className="mt-4 text-sm text-[#bababa]">
          Connect Supabase Auth (email magic link or SSO) and set{' '}
          <code className="text-accent">VITE_SUPABASE_URL</code> /{' '}
          <code className="text-accent">VITE_SUPABASE_ANON_KEY</code> in Vercel.
          Login UI wires to{' '}
          <code className="text-accent">supabase.auth.signInWithPassword</code>{' '}
          once credentials are provisioned.
        </p>
        <Link to="/admin" className="text-button mt-8 underline">
          Continue to dashboard shell →
        </Link>
      </Container>
    </div>
  )
}
