import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminGuard() {
  const { loading, session, isAdmin, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface-soft p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-heading-4">CMS not configured</h1>
          <p className="mt-3 text-sm text-title-muted">
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, run{' '}
            <code>002_full_cms.sql</code>, then enroll your Auth user in{' '}
            <code>cms_admin_users</code>.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface-soft">
        <p className="text-sm text-title-muted">Checking session…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface-soft p-8">
        <div className="max-w-md text-center">
          <h1 className="text-heading-4">Access denied</h1>
          <p className="mt-3 text-sm text-title-muted">
            Your account is signed in but not enrolled in{' '}
            <code>cms_admin_users</code>. Ask the project owner to add your Auth
            UID.
          </p>
          <a href="/admin/login" className="mt-6 inline-block text-sm underline">
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return <Outlet />
}
