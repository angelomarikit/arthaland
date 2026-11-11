import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchAdminDevelopment, updateDevelopment } from '../../lib/cms/developmentsApi'
import { uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'
import type { DbDevelopment } from '../../lib/supabase/database.types'

export function AdminPropertySpecificationsPage() {
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
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    try {
      await updateDevelopment(dev.id, {
        total_stories: String(fd.get('total_stories') ?? '') || null,
        total_units: String(fd.get('total_units') ?? '') || null,
        completion_date: String(fd.get('completion_date') ?? '') || null,
        developer_name: String(fd.get('developer_name') ?? '') || null,
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
          { label: 'Specifications' },
        ]}
      />
      <h1 className="text-2xl font-medium">Specifications</h1>
      <form onSubmit={onSave} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Total stories
          <input
            name="total_stories"
            defaultValue={dev.total_stories ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Total units
          <input
            name="total_units"
            defaultValue={dev.total_units ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Completion date
          <input
            name="completion_date"
            type="date"
            defaultValue={dev.completion_date?.slice(0, 10) ?? ''}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Developer name
          <input
            name="developer_name"
            defaultValue={dev.developer_name ?? ''}
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
        <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">
          Overview image
        </h2>
        <MediaUploadZone
          label="Upload overview"
          accept="image"
          onUpload={async (file, onProgress) => {
            const row = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: `developments/${dev.id}/overview`,
              developmentId: dev.id,
              developmentSlug: slug,
              placement: 'gallery',
              published: true,
              displayOrder: 0,
              onProgress,
            })
            await updateDevelopment(dev.id, { overview_media_id: row.id })
            setDev(await fetchAdminDevelopment(slug))
          }}
        />
        {dev.overview_media_id && (
          <p className="mt-2 text-xs text-title-muted">Overview media id: {dev.overview_media_id}</p>
        )}
      </div>
    </div>
  )
}
