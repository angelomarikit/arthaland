import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import {
  formatSectionPreview,
  getLivePageSections,
} from '../../config/pageContentRegistry'
import {
  fetchPageSections,
  updatePageSection,
  upsertPageSection,
} from '../../lib/cms/pagesApi'
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
  const liveSection = useMemo(
    () => getLivePageSections(slug).find((s) => s.sectionKey === sectionKey),
    [slug, sectionKey],
  )
  const [sectionId, setSectionId] = useState('')
  const [sectionType, setSectionType] = useState(liveSection?.sectionType ?? 'richtext')
  const [displayOrder, setDisplayOrder] = useState(liveSection?.displayOrder ?? 0)
  const [content, setContent] = useState<SectionContent>(liveSection?.content ?? {})
  const [published, setPublished] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPageSections(slug).then((sections) => {
      const sec = sections.find((s) => s.section_key === sectionKey)
      if (sec) {
        setSectionId(sec.id)
        setSectionType(sec.section_type)
        setDisplayOrder(sec.display_order)
        setContent((sec.content as SectionContent) ?? {})
        setPublished(sec.published)
      } else if (liveSection) {
        setSectionType(liveSection.sectionType)
        setDisplayOrder(liveSection.displayOrder)
        setContent(liveSection.content)
      }
    })
  }, [slug, sectionKey, liveSection])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const payload = content as Record<string, unknown>
      if (sectionId) {
        await updatePageSection(sectionId, { content: payload, published })
      } else {
        const id = await upsertPageSection({
          pageSlug: slug,
          sectionKey,
          sectionType,
          content: payload,
          published,
          displayOrder,
        })
        setSectionId(id)
      }
      setMessage('Saved to the CMS. The live site still uses built-in text until this section is connected.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const title = liveSection?.label ?? sectionKey.replace(/-/g, ' ')
  const livePreview = liveSection ? formatSectionPreview(liveSection.content, 400) : null

  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: 'Pages', href: '/admin/pages' },
          { label: slug, href: `/admin/pages/${slug}` },
          { label: title },
        ]}
      />
      <h1 className="text-2xl font-medium">{title}</h1>

      {livePreview ? (
        <div className="mt-4 rounded-xl bg-surface-soft px-4 py-3 text-sm">
          <p className="text-[10px] font-medium uppercase tracking-wider text-title-muted">
            On the website now
          </p>
          <p className="mt-2 leading-relaxed text-ink">{livePreview}</p>
        </div>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed text-title-muted">
        Fields below start from the live copy. Edit and save to store updates in the CMS.
      </p>

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
          helperText="Optional — for when this section is wired to the live page."
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
          Mark as published in CMS (for future live connection)
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-emerald-800">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink px-5 py-2.5 text-sm text-surface disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save section'}
        </button>
      </form>
    </div>
  )
}
