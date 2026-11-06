export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
}

/** Same rules as `useSupabaseCms` — safe to call from non-React modules. */
export function isSupabaseCmsEnabled(): boolean {
  if (!isSupabaseConfigured()) return false
  const raw = String(import.meta.env.VITE_CMS_SOURCE ?? '')
    .trim()
    .toLowerCase()
  if (
    raw === 'false' ||
    raw === '0' ||
    raw === 'off' ||
    raw === 'local' ||
    raw === 'seed'
  ) {
    return false
  }
  return true
}

/**
 * Public site and admin read/write CMS data through Supabase when URL + anon key are set.
 * Optional `VITE_CMS_SOURCE`: use `false` / `local` to keep local seed data for demos without a DB.
 */
export function useSupabaseCms(): boolean {
  return isSupabaseCmsEnabled()
}

export const IMAGE_MAX_BYTES = 15 * 1024 * 1024
export const VIDEO_MAX_BYTES = 100 * 1024 * 1024

export const IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const

export const VIDEO_MIME = ['video/mp4', 'video/webm', 'video/quicktime'] as const
