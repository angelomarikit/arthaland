export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
}

export function useSupabaseCms(): boolean {
  return (
    isSupabaseConfigured() &&
    (import.meta.env.VITE_CMS_SOURCE === 'supabase' ||
      import.meta.env.VITE_CMS_SOURCE === 'true')
  )
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
