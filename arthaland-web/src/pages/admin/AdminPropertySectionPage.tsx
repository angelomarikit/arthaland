import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import {
  fetchAdminDevelopment,
  fetchDevelopmentSections,
  updateDevelopmentSection,
} from '../../lib/cms/developmentsApi'
import { uploadMediaWithMetadata, mediaPublicUrl } from '../../lib/cms/mediaUpload'
import type { DbDevelopmentSection } from '../../lib/supabase/database.types'

type SectionContent = {
  eyebrow?: string
  title?: string
  subtitle?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  items?: string[]
  mediaId?: string
  imageUrl?: string
}

export function AdminPropertySectionPage() {
  const { slug = '', sectionKey = '' } = useParams()
  const [devName, setDevName] = useState('')
  const [section, setSection] = useState<DbDevelopmentSection | null>(null)
  const [content, setContent] = useState<SectionContent>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug || !sectionKey) return
    Promise.all([fetchAdminDevelopment(slug), fetchDevelopmentSections(slug)]).then(
      ([dev, sections]) => {
        setDevName(dev?.name ?? slug)
        const sec = sections.find((s) => s.section_key === sectionKey) ?? null
        setSection(sec)
        setContent((sec?.content as SectionContent) ?? {})
      },
    )
  }, [slug, sectionKey])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!section) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await updateDevelopmentSection(section.id, {
        content: content as Record<string, unknown>,
        published: (e.target as HTMLFormElement).published.checked,
      })
      setMessage('Section saved to Supabase.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!section) {
    return <p className="text-sm text-title-muted">Loading section…</p>
  }

  const title = sectionKey.replace(/-/g, ' ')

  return (
    <div className="max-w-3xl">
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: devName, href: `/admin/properties/${slug}` },
          { label: title },
        ]}
      />
      <h1 className="text-2xl font-medium capitalize">{title}</h1>

      <form onSubmit={onSave} className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Eyebrow
          <input
            value={content.eyebrow ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Title
          <input
            value={content.title ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Subtitle
          <input
            value={content.subtitle ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, subtitle: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Body (HTML allowed — sanitized on public site)
          <textarea
            rows={8}
            value={content.body ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, body: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
          />
        </label>
        <label className="block text-sm">
          Bullet items (one per line)
          <textarea
            rows={4}
            value={(content.items ?? []).join('\n')}
            onChange={(e) =>
              setContent((c) => ({
                ...c,
                items: e.target.value.split('\n').filter(Boolean),
              }))
            }
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            CTA label
            <input
              value={content.ctaLabel ?? ''}
              onChange={(e) => setContent((c) => ({ ...c, ctaLabel: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            CTA route
            <input
              value={content.ctaHref ?? ''}
              onChange={(e) => setContent((c) => ({ ...c, ctaHref: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
              placeholder="/contact"
            />
          </label>
        </div>

        <MediaUploadZone
          label="Section image"
          accept="image"
          previewUrl={content.imageUrl}
          helperText="Stored in Supabase Storage; URL is not pasted manually."
          onUpload={async (file, onProgress) => {
            const dev = await fetchAdminDevelopment(slug)
            if (!dev) throw new Error('Development not found')
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: `developments/${dev.id}/sections/${sectionKey}`,
              developmentId: dev.id,
              developmentSlug: slug,
              pageSectionId: section.id,
              placement: sectionKey,
              published: true,
              onProgress,
            })
            const url = mediaPublicUrl(media)
            setContent((c) => ({ ...c, mediaId: media.id, imageUrl: url }))
          }}
        />

        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked={section.published} />
          Publish this section on the public site
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-emerald-800">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink px-4 py-2.5 text-sm text-surface disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save section'}
        </button>
      </form>
    </div>
  )
}
