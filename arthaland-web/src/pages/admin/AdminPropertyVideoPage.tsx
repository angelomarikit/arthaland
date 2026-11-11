import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchAdminDevelopment, updateDevelopment } from '../../lib/cms/developmentsApi'
import {
  clearDevelopmentShowcaseVideo,
  clearDevelopmentShowcaseVideoPosterOnly,
  replaceDevelopmentShowcaseVideo,
  replaceDevelopmentShowcaseVideoPoster,
} from '../../lib/cms/mediaUpload'
import type { DbDevelopment, VideoSource } from '../../lib/supabase/database.types'

export function AdminPropertyVideoPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminDevelopment(slug).then(setDev)
  }, [slug])

  async function onSaveExternal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
    await updateDevelopment(dev.id, {
      video_source: String(fd.get('video_source') ?? 'upload') as VideoSource,
      video_url: String(fd.get('video_url') ?? '') || null,
      video_poster: String(fd.get('video_poster') ?? '') || null,
    })
    setSaved(true)
    setDev(await fetchAdminDevelopment(slug))
  }

  if (!dev) return <p className="text-sm text-title-muted">Loading…</p>

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev.name, href: `/admin/properties/${slug}` },
          { label: 'Video' },
        ]}
      />
      <h1 className="text-2xl font-medium">Showcase video</h1>

      <form onSubmit={onSaveExternal} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Video source
          <select
            name="video_source"
            defaultValue={dev.video_source ?? 'upload'}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          >
            <option value="upload">Upload (MP4 in storage)</option>
            <option value="external">External URL (YouTube/Vimeo/etc.)</option>
          </select>
        </label>
        <label className="block text-sm">
          Video URL
          <input
            name="video_url"
            defaultValue={dev.video_url ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Poster URL
          <input
            name="video_poster"
            defaultValue={dev.video_poster ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        {saved && <p className="text-sm text-emerald-800">Saved.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save URLs
        </button>
      </form>

      <div className="mt-8 grid max-w-xl gap-6">
        <MediaUploadZone
          label="Upload MP4"
          accept="video"
          onUpload={async (file, onProgress) => {
            await replaceDevelopmentShowcaseVideo(dev.id, slug, file, onProgress)
            setDev(await fetchAdminDevelopment(slug))
          }}
        />
        <MediaUploadZone
          label="Upload poster"
          accept="image"
          onUpload={async (file, onProgress) => {
            await replaceDevelopmentShowcaseVideoPoster(dev.id, slug, file, onProgress)
            setDev(await fetchAdminDevelopment(slug))
          }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-xs"
            onClick={() => void clearDevelopmentShowcaseVideoPosterOnly(dev.id).then(() => fetchAdminDevelopment(slug).then(setDev))}
          >
            Clear poster only
          </button>
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-xs text-red-800"
            onClick={() => void clearDevelopmentShowcaseVideo(dev.id).then(() => fetchAdminDevelopment(slug).then(setDev))}
          >
            Clear video
          </button>
        </div>
      </div>
    </div>
  )
}
