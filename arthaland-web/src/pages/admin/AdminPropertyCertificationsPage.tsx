import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchAdminDevelopment } from '../../lib/cms/developmentsApi'
import { uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'
import {
  deleteCertification,
  fetchAdminCertifications,
  upsertCertification,
} from '../../lib/cms/propertyDetailApi'
import type {
  CertificationStatus,
  DbDevelopment,
  DbDevelopmentCertification,
} from '../../lib/supabase/database.types'

export function AdminPropertyCertificationsPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [rows, setRows] = useState<DbDevelopmentCertification[]>([])
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    const [d, certs] = await Promise.all([
      fetchAdminDevelopment(slug),
      fetchAdminCertifications(slug),
    ])
    setDev(d)
    setRows(certs)
  }

  useEffect(() => {
    reload().catch((e: Error) => setError(e.message))
  }, [slug])

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
    await upsertCertification({
      id: crypto.randomUUID(),
      development_id: dev.id,
      development_slug: slug,
      name: String(fd.get('name') ?? ''),
      status: String(fd.get('status') ?? 'targeted') as CertificationStatus,
      logo_media_id: null,
      display_order: rows.length,
      published: fd.get('published') === 'on',
    })
    e.currentTarget.reset()
    await reload()
  }

  if (!dev && !error) return <p className="text-sm text-title-muted">Loading…</p>

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev?.name ?? slug, href: `/admin/properties/${slug}` },
          { label: 'Certifications' },
        ]}
      />
      <h1 className="text-2xl font-medium">Certifications</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={onAdd} className="mt-6 max-w-xl space-y-3 rounded-2xl border border-border bg-surface p-6">
        <input name="name" required placeholder="Certification name" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <select name="status" className="w-full rounded-xl border border-border px-3 py-2 text-sm">
          <option value="registered">Registered</option>
          <option value="on_track">On track</option>
          <option value="targeted">Targeted</option>
          <option value="certified">Certified</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" />
          Published
        </label>
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Add certification
        </button>
      </form>

      <ul className="mt-8 space-y-6">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium">{row.name}</p>
              <button
                type="button"
                className="text-xs text-red-800"
                onClick={() => void deleteCertification(row.id).then(reload)}
              >
                Delete
              </button>
            </div>
            <p className="text-xs text-title-muted">{row.status}</p>
            <MediaUploadZone
              label="Logo"
              accept="image"
              onUpload={async (file, onProgress) => {
                if (!dev) return
                const media = await uploadMediaWithMetadata({
                  file,
                  bucket: 'arthaland-images',
                  folder: `developments/${dev.id}/certifications`,
                  developmentId: dev.id,
                  developmentSlug: slug,
                  placement: 'gallery',
                  published: true,
                  displayOrder: 0,
                  onProgress,
                })
                await upsertCertification({ ...row, logo_media_id: media.id })
                await reload()
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
