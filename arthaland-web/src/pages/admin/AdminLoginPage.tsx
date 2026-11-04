import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminLoginPage() {
  const { signIn, resetPassword, session, isAdmin, loading, configured } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session && isAdmin) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    try {
      if (mode === 'reset') {
        const { error: err } = await resetPassword(email)
        if (err) setError(err)
        else setMessage('Check your email for the password reset link.')
      } else {
        const { error: err } = await signIn(email, password)
        if (err) setError(err)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f7f5f2] px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-title-muted">
          ARTHALAND CMS
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Sign in</h1>
        {!configured && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-950">
            Supabase env vars are missing. Add them in Vercel or <code>.env.local</code>{' '}
            before logging in.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            />
          </label>
          {mode === 'login' && (
            <label className="block text-sm">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
              />
            </label>
          )}
          {error && <p className="text-sm text-red-700">{error}</p>}
          {message && <p className="text-sm text-emerald-800">{message}</p>}
          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-surface disabled:opacity-50"
          >
            {submitting
              ? 'Please wait…'
              : mode === 'reset'
                ? 'Send reset link'
                : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm text-title-muted underline"
          onClick={() => setMode(mode === 'login' ? 'reset' : 'login')}
        >
          {mode === 'login' ? 'Forgot password?' : 'Back to sign in'}
        </button>

        <Link to="/" className="mt-8 block text-center text-sm text-title-muted hover:text-ink">
          ← View public website
        </Link>
      </div>
    </div>
  )
}
