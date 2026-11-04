import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchPageSections, updatePageSection } from '../../lib/cms/pagesApi'
import { uploadMediaWithMetadata, mediaPublicUrl } from '../../lib/cms/mediaUpload'

type SectionContent = {
  eyebrow?: string
  title?: string
  subtitle?: string
  body?: string
  imageUrl?: string
}

export function AdminPageSectionPage() {
  const { slug = '', sectionKey = '' } = useParams()
  const [sectionId, setSectionId] = useState('')
  const [content, setContent] = useState<SectionContent>({})
  const [published, setPublished] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPageSections(slug).then((sections) => {
      const sec = sections.find((s) => s.section_key === sectionKey)
      if (sec) {
        setSectionId(sec.id)
        setContent((sec.content as SectionContent) ?? {})
        setPublished(sec.published)
      }
    })
  }, [slug, sectionKey])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!sectionId) return
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await updatePageSection(sectionId, {
        content: content as Record<string, unknown>,
        published,
      })
      setMessage('Saved successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const title = sectionKey.replace(/-/g, ' ')

  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: 'Pages', href: '/admin/pages' },
          { label: slug, href: `/admin/pages/${slug}` },
          { label: title },
        ]}
      />
      <h1 className="text-2xl font-medium capitalize">{title}</h1>
      <p className="mt-2 text-sm text-title-muted">
        Edit text and images with the fields below — nothing technical required.
      </p>

      {!sectionId && (
        <p className="mt-4 text-sm text-title-muted">
          This section is not in the database yet. Run the CMS setup script or ask
          your developer to add a row for “{sectionKey}” on page “{slug}”.
        </p>
      )}

      <form onSubmit={onSave} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Small label above heading (optional)
          <input
            value={content.eyebrow ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            placeholder="e.g. About us"
          />
        </label>
        <label className="block text-sm">
          Heading
          <input
            value={content.title ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Supporting line (optional)
          <input
            value={content.subtitle ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, subtitle: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Main text
          <textarea
            rows={6}
            value={content.body ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, body: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm leading-relaxed"
            placeholder="Write in plain language — line breaks are kept."
          />
        </label>

        <MediaUploadZone
          label="Section photo"
          accept="image"
          previewUrl={content.imageUrl}
          helperText="Upload replaces the image for this section on the website."
          onUpload={async (file, onProgress) => {
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: `pages/${slug}/sections/${sectionKey}`,
              pageSectionId: sectionId || undefined,
              placement: sectionKey,
              published: true,
              onProgress,
            })
            setContent((c) => ({ ...c, imageUrl: mediaPublicUrl(media) }))
          }}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Show this section on the live website
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-emerald-800">{message}</p>}
        <button
          type="submit"
          disabled={saving || !sectionId}
          className="rounded-xl bg-ink px-5 py-2.5 text-sm text-surface disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save section'}
        </button>
      </form>
    </div>
  )
}
