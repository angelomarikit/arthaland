import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchAdminDevelopment, updateDevelopment } from '../../lib/cms/developmentsApi'
import { uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'
import type { DbDevelopment } from '../../lib/supabase/database.types'

export function AdminPropertyLocationPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminDevelopment(slug).then(setDev).catch((e: Error) => setError(e.message))
  }, [slug])

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
    try {
      await updateDevelopment(dev.id, {
        map_lat: fd.get('map_lat') ? Number(fd.get('map_lat')) : null,
        map_lng: fd.get('map_lng') ? Number(fd.get('map_lng')) : null,
        map_url: String(fd.get('map_url') ?? '') || null,
        directions_url: String(fd.get('directions_url') ?? '') || null,
      })
      setSaved(true)
      setDev(await fetchAdminDevelopment(slug))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  if (!dev && !error) return <p className="text-sm text-title-muted">Loading…</p>
  if (!dev) return <p className="text-sm text-red-700">{error}</p>

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev.name, href: `/admin/properties/${slug}` },
          { label: 'Location' },
        ]}
      />
      <h1 className="text-2xl font-medium">Location & map</h1>
      <form onSubmit={onSave} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Latitude
          <input
            name="map_lat"
            type="number"
            step="any"
            defaultValue={dev.map_lat ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Longitude
          <input
            name="map_lng"
            type="number"
            step="any"
            defaultValue={dev.map_lng ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Map image URL (or public image URL after upload below)
          <input
            name="map_url"
            defaultValue={dev.map_url ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Directions URL
          <input
            name="directions_url"
            defaultValue={dev.directions_url ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-emerald-800">Saved.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save
        </button>
      </form>

      <div className="mt-8 max-w-xl rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-medium">Upload map image</h2>
        <p className="mt-1 text-xs text-title-muted">
          After upload, copy the public URL into map URL if needed.
        </p>
        <MediaUploadZone
          label="Map image"
          accept="image"
          onUpload={async (file, onProgress) => {
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: `developments/${dev.id}/map`,
              developmentId: dev.id,
              developmentSlug: slug,
              placement: 'gallery',
              published: true,
              displayOrder: 0,
              onProgress,
            })
            const { mediaPublicUrl } = await import('../../lib/cms/mediaUpload')
            await updateDevelopment(dev.id, { map_url: mediaPublicUrl(media) })
            setDev(await fetchAdminDevelopment(slug))
          }}
        />
      </div>
    </div>
  )
}
