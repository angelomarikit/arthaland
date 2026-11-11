import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { propertySectionLinks } from '../../components/admin/adminNavConfig'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import {
  fetchAdminDevelopment,
  fetchDevelopmentSections,
  updateDevelopment,
} from '../../lib/cms/developmentsApi'
import {
  replaceDevelopmentHeroMedia,
  replaceDevelopmentShowcaseVideo,
  replaceDevelopmentShowcaseVideoPoster,
  clearDevelopmentShowcaseVideo,
  clearDevelopmentShowcaseVideoPosterOnly,
  clearDevelopmentHeroMedia,
} from '../../lib/cms/mediaUpload'
import type { DbDevelopment, DbDevelopmentSection } from '../../lib/supabase/database.types'

export function AdminPropertyOverviewPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [sections, setSections] = useState<DbDevelopmentSection[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    Promise.all([fetchAdminDevelopment(slug), fetchDevelopmentSections(slug)])
      .then(([d, s]) => {
        setDev(d)
        setSections(s)
      })
      .catch((e: Error) => setError(e.message))
  }, [slug])

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    setSaving(true)
    setSaved(false)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      await updateDevelopment(dev.id, {
        name: String(fd.get('name') ?? dev.name),
        location: String(fd.get('location') ?? ''),
        region: String(fd.get('region') ?? ''),
        category: String(fd.get('category') ?? ''),
        hero_subtitle: String(fd.get('hero_subtitle') ?? '') || null,
        publication_status: String(fd.get('publication_status') ?? 'draft') as DbDevelopment['publication_status'],
        availability_status: String(fd.get('availability_status') ?? ''),
        short_description: String(fd.get('short_description') ?? ''),
        full_description: String(fd.get('full_description') ?? ''),
        price_label: String(fd.get('price_label') ?? ''),
        featured: fd.get('featured') === 'on',
        display_order: Number(fd.get('display_order') ?? 0),
        uses_illustrative_imagery: fd.get('uses_illustrative_imagery') === 'on',
        official_url: String(fd.get('official_url') ?? ''),
      })
      setSaved(true)
      const refreshed = await fetchAdminDevelopment(slug)
      setDev(refreshed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!dev && !error) {
    return <p className="text-sm text-title-muted">Loading property…</p>
  }

  if (!dev) {
    return <p className="text-sm text-red-700">{error ?? 'Not found'}</p>
  }

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev.name },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">{dev.name}</h1>
        <Link
          to={`/properties/${dev.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
        >
          Preview public page
        </Link>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">
            Basic information
          </h2>
          {(
            [
              ['name', 'Name', dev.name],
              ['location', 'Location', dev.location],
              ['region', 'Region', dev.region],
              ['price_label', 'Price label', dev.price_label],
              ['official_url', 'Official URL', dev.official_url ?? ''],
            ] as const
          ).map(([key, label, val]) => (
            <label key={key} className="block text-sm">
              {label}
              <input
                name={key}
                defaultValue={val}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
              />
            </label>
          ))}

          <label className="block text-sm">
            Category
            <select
              name="category"
              defaultValue={dev.category ?? 'residential'}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed-use">Mixed-Use</option>
            </select>
          </label>

          <label className="block text-sm">
            Publication status
            <select
              name="publication_status"
              defaultValue={dev.publication_status ?? 'draft'}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            >
              <option value="published">Published</option>
              <option value="coming_soon">Coming soon</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived (admin only)</option>
            </select>
          </label>

          <label className="block text-sm">
            Hero subtitle
            <input
              name="hero_subtitle"
              defaultValue={dev.hero_subtitle ?? ''}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Availability
            <input
              name="availability_status"
              defaultValue={dev.availability_status ?? dev.status}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Display order
            <input
              name="display_order"
              type="number"
              defaultValue={dev.display_order ?? 0}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Short description
            <textarea
              name="short_description"
              rows={3}
              defaultValue={dev.short_description ?? dev.summary ?? ''}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            Full description
            <textarea
              name="full_description"
              rows={6}
              defaultValue={dev.full_description ?? dev.overview ?? ''}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" defaultChecked={Boolean(dev.featured)} />
            Featured on portfolio
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="uses_illustrative_imagery"
              type="checkbox"
              defaultChecked={Boolean(dev.uses_illustrative_imagery)}
            />
            Uses illustrative (non-verified) imagery
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}
          {saved && <p className="text-sm text-emerald-800">Saved to Supabase.</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-ink px-4 py-2.5 text-sm text-surface disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <div className="space-y-6">
          <MediaUploadZone
            label="Hero image"
            accept="image"
            previewUrl={dev.hero_image}
            helperText="Upload replaces hero in Storage + developments row. Max 15 MB."
            onUpload={async (file, onProgress) => {
              await replaceDevelopmentHeroMedia(dev.id, dev.slug, file, dev.hero_media_id, onProgress)
              const refreshed = await fetchAdminDevelopment(slug)
              setDev(refreshed)
            }}
            onRemove={
              dev.hero_image
                ? async () => {
                    await clearDevelopmentHeroMedia(dev.id)
                    const refreshed = await fetchAdminDevelopment(slug)
                    setDev(refreshed)
                  }
                : undefined
            }
          />

          <MediaUploadZone
            label="Showcase video (property page bottom)"
            accept="video"
            previewUrl={dev.video_url ?? undefined}
            helperText="MP4, WebM, or MOV — max 100 MB. Stored in arthaland-videos; public page shows this near the bottom after Related."
            onUpload={async (file, onProgress) => {
              await replaceDevelopmentShowcaseVideo(dev.id, dev.slug, file, onProgress)
              const refreshed = await fetchAdminDevelopment(slug)
              setDev(refreshed)
            }}
            onRemove={
              dev.video_url
                ? async () => {
                    await clearDevelopmentShowcaseVideo(dev.id)
                    const refreshed = await fetchAdminDevelopment(slug)
                    setDev(refreshed)
                  }
                : undefined
            }
          />

          <MediaUploadZone
            label="Video poster (optional)"
            accept="image"
            previewUrl={dev.video_poster ?? undefined}
            helperText="Thumbnail before play — JPEG/PNG/WebP, max 15 MB. Clear showcase video above to remove poster too."
            onUpload={async (file, onProgress) => {
              await replaceDevelopmentShowcaseVideoPoster(dev.id, dev.slug, file, onProgress)
              const refreshed = await fetchAdminDevelopment(slug)
              setDev(refreshed)
            }}
            onRemove={
              dev.video_poster
                ? async () => {
                    await clearDevelopmentShowcaseVideoPosterOnly(dev.id)
                    const refreshed = await fetchAdminDevelopment(slug)
                    setDev(refreshed)
                  }
                : undefined
            }
          />

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-title-muted">
              Sections
            </h2>
            <ul className="mt-4 space-y-2">
              {propertySectionLinks(slug).map((s) => {
                const sec = sections.find((x) => x.section_key === s.key)
                return (
                  <li key={s.key} className="flex items-center justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="text-xs text-title-muted">
                      {sec?.published ? 'Published' : 'Draft'}
                    </span>
                    <Link to={s.href} className="text-xs underline">
                      Edit
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
