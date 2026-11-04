import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { siteConfig } from '../../config/site'
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src={siteConfig.seo.ogImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-surface">
          <div>
            <img
              src={siteConfig.brand.logoLockupSrc}
              alt="ARTHALAND"
              className="h-12 w-auto invert"
            />
            <p className="mt-10 max-w-md text-3xl font-medium leading-tight tracking-tight">
              Content management for the ARTHALAND website
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-surface/75">
              Update properties, photos, and inquiries in one place — built for
              marketing and sales teams, not developers.
            </p>
          </div>
          <p className="text-xs text-surface/50">
            Authorized staff only · Changes save to your secure database
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-[#f7f5f2] px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img
              src={siteConfig.brand.logoLockupSrc}
              alt="ARTHALAND"
              className="h-10 w-auto"
            />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-title-muted">
            CMS sign in
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-ink">
            {mode === 'reset' ? 'Reset password' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-title-muted">
            Use the email and password provided by your administrator.
          </p>

          {!configured && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
              This environment is not connected to the database yet. Ask your
              technical contact to set up Supabase on Vercel.
            </p>
          )}

          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            <label className="block text-sm font-medium text-ink">
              Email address
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-[#fafafa] px-4 py-3 text-sm outline-none transition-colors focus:border-ink/40 focus:bg-surface"
                placeholder="you@company.com"
              />
            </label>
            {mode === 'login' && (
              <label className="block text-sm font-medium text-ink">
                Password
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-[#fafafa] px-4 py-3 text-sm outline-none transition-colors focus:border-ink/40 focus:bg-surface"
                />
              </label>
            )}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
            )}
            {message && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting || !configured}
              className="w-full rounded-xl bg-ink py-3.5 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? 'Please wait…'
                : mode === 'reset'
                  ? 'Send reset link'
                  : 'Sign in to CMS'}
            </button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-title-muted underline-offset-2 hover:text-ink hover:underline"
            onClick={() => setMode(mode === 'login' ? 'reset' : 'login')}
          >
            {mode === 'login' ? 'Forgot your password?' : '← Back to sign in'}
          </button>

          <Link
            to="/"
            className="mt-10 inline-flex items-center text-sm text-title-muted hover:text-ink"
          >
            ← View public website
          </Link>
        </div>
      </div>
    </div>
  )
}
