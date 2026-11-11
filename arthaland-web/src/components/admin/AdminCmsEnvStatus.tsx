import { isSupabaseConfigured, isSupabaseCmsEnabled } from '../../lib/supabase/config'

function cmsSourceLabel(): string {
  const raw = String(import.meta.env.VITE_CMS_SOURCE ?? '').trim()
  return raw || '(unset — Supabase when URL + anon key exist)'
}

/** Explains whether this build’s public site reads from Supabase (same as admin when env matches). */
export function AdminCmsEnvStatus({ className = '' }: { className?: string }) {
  const configured = isSupabaseConfigured()
  const cmsOn = isSupabaseCmsEnabled()
  const source = cmsSourceLabel()

  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-5 text-sm ${className}`}
      role="status"
    >
      <h2 className="font-medium">Public site data source</h2>
      <ul className="mt-3 space-y-2 text-title-muted">
        <li>
          Supabase URL + anon key:{' '}
          <span className={configured ? 'text-emerald-800' : 'text-red-800'}>
            {configured ? 'Present in this build' : 'Missing — uploads cannot sync'}
          </span>
        </li>
        <li>
          CMS mode (`VITE_CMS_SOURCE`): <span className="text-ink">{source}</span>
        </li>
        <li>
          Public pages use database:{' '}
          <span className={cmsOn ? 'text-emerald-800' : 'text-amber-900'}>
            {cmsOn ? 'Yes' : 'No (bundled seed / offline demo)'}
          </span>
        </li>
      </ul>
      {!cmsOn && configured && (
        <p className="mt-3 text-xs text-amber-950">
          `VITE_CMS_SOURCE` is forcing local seed. Remove `local` / `false` / `seed` on Vercel and
          redeploy so the live site shows admin uploads.
        </p>
      )}
      {cmsOn && (
        <p className="mt-3 text-xs text-title-muted">
          Production must use the same Supabase project. Env vars are baked in at build time —
          change Vercel env, then trigger a new deploy.
        </p>
      )}
    </div>
  )
}
