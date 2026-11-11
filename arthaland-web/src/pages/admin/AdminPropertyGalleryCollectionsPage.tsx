import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminDevelopment, fetchDevelopmentMedia } from '../../lib/cms/developmentsApi'
import {
  assignMediaToCollection,
  deleteGalleryCollection,
  fetchAdminGalleryCollections,
  upsertGalleryCollection,
} from '../../lib/cms/propertyDetailApi'
import type { DbCmsMedia, DbDevelopment, DbGalleryCollection } from '../../lib/supabase/database.types'

export function AdminPropertyGalleryCollectionsPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [collections, setCollections] = useState<DbGalleryCollection[]>([])
  const [media, setMedia] = useState<DbCmsMedia[]>([])

  async function reload() {
    const [d, cols, m] = await Promise.all([
      fetchAdminDevelopment(slug),
      fetchAdminGalleryCollections(slug),
      fetchDevelopmentMedia(slug),
    ])
    setDev(d)
    setCollections(cols)
    setMedia(m.filter((x) => x.media_kind === 'image' && x.placement !== 'floor_plan'))
  }

  useEffect(() => {
    void reload()
  }, [slug])

  async function onAddCollection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
    await upsertGalleryCollection({
      id: crypto.randomUUID(),
      development_id: dev.id,
      development_slug: slug,
      slug: String(fd.get('slug') ?? ''),
      title: String(fd.get('title') ?? ''),
      description: String(fd.get('description') ?? '') || null,
      display_order: collections.length,
      published: fd.get('published') === 'on',
    })
    e.currentTarget.reset()
    await reload()
  }

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev?.name ?? slug, href: `/admin/properties/${slug}` },
          { label: 'Gallery collections' },
        ]}
      />
      <h1 className="text-2xl font-medium">Gallery collections</h1>
      <p className="mt-2 text-sm text-title-muted">
        Upload images on Media library, then assign them to a collection below.
      </p>

      <form onSubmit={onAddCollection} className="mt-6 max-w-xl space-y-3 rounded-2xl border border-border bg-surface p-6">
        <input name="slug" required placeholder="Slug (facade)" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <input name="title" required placeholder="Title" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Description" rows={2} className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" />
          Published
        </label>
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Add collection
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {collections.map((c) => (
          <li key={c.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-medium">
                {c.title} <span className="text-xs text-title-muted">({c.slug})</span>
              </p>
              <button
                type="button"
                className="text-xs text-red-800"
                onClick={() => void deleteGalleryCollection(c.id).then(reload)}
              >
                Delete collection
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-medium">Assign media</h2>
      <ul className="mt-4 space-y-3">
        {media.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3 text-sm">
            <span className="truncate text-xs text-title-muted">{m.storage_path}</span>
            <select
              className="rounded-lg border border-border px-2 py-1 text-xs"
              value={m.gallery_collection_id ?? ''}
              onChange={(e) =>
                void assignMediaToCollection(
                  m.id,
                  e.target.value ? e.target.value : null,
                ).then(reload)
              }
            >
              <option value="">Unassigned (legacy gallery)</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  )
}
