import { useEffect, useState } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaThumb } from '../../components/admin/MediaUploadZone'
import { getSupabaseClient } from '../../lib/supabase/client'
import type { DbCmsMedia } from '../../lib/supabase/database.types'

export function AdminMediaLibraryPage() {
  const [media, setMedia] = useState<DbCmsMedia[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    supabase
      .from('cms_media')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setMedia((data ?? []) as DbCmsMedia[])
      })
  }, [])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Media library' }]} />
      <h1 className="text-2xl font-medium">Media library</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-square bg-surface-muted">
              {m.media_kind === 'image' ? (
                <MediaThumb media={m} />
              ) : (
                <div className="flex size-full items-center justify-center text-xs">Video</div>
              )}
            </div>
            <p className="truncate p-2 text-xs text-title-muted">{m.placement ?? m.storage_path}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
