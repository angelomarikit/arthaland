import { useEffect, useState } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaThumb, MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { uploadMediaBatch } from '../../lib/cms/mediaUpload'
import { getSupabaseClient } from '../../lib/supabase/client'
import type { DbCmsMedia } from '../../lib/supabase/database.types'

export function AdminMediaLibraryPage() {
  const [media, setMedia] = useState<DbCmsMedia[]>([])
  const [error, setError] = useState<string | null>(null)
  const [bulkFolder, setBulkFolder] = useState('library/bulk')

  function reloadLibrary() {
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
  }

  useEffect(() => {
    reloadLibrary()
  }, [])

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Media library' }]} />
      <h1 className="text-2xl font-medium">Media library</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 max-w-xl space-y-3">
        <label className="block text-sm">
          Bulk upload folder (Storage path)
          <input
            type="text"
            value={bulkFolder}
            onChange={(e) => setBulkFolder(e.target.value.replace(/^\/+|\/+$/g, ''))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-mono text-sm"
            placeholder="library/bulk"
          />
        </label>
        <MediaUploadZone
          multiple
          label="Bulk upload images"
          accept="image"
          helperText="Files upload to Supabase Storage under your folder and appear below (draft — link from Properties or Pages)."
          onUpload={async (files, onProgress) => {
            const startOrder = media.length
            await uploadMediaBatch(
              files,
              (_file, index) => ({
                bucket: 'arthaland-images',
                folder: bulkFolder || 'library/bulk',
                placement: 'library_bulk',
                displayOrder: startOrder + index,
                published: false,
              }),
              onProgress,
            )
            reloadLibrary()
          }}
        />
      </div>
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
