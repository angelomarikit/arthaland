import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchPageSections, updatePageSection } from '../../lib/cms/pagesApi'

export function AdminPageSectionPage() {
  const { slug = '', sectionKey = '' } = useParams()
  const [sectionId, setSectionId] = useState('')
  const [contentJson, setContentJson] = useState('{\n  \n}')
  const [published, setPublished] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchPageSections(slug).then((sections) => {
      const sec = sections.find((s) => s.section_key === sectionKey)
      if (sec) {
        setSectionId(sec.id)
        setContentJson(JSON.stringify(sec.content ?? {}, null, 2))
        setPublished(sec.published)
      }
    })
  }, [slug, sectionKey])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!sectionId) return
    const content = JSON.parse(contentJson) as Record<string, unknown>
    await updatePageSection(sectionId, { content, published })
    setMessage('Saved to Supabase.')
  }

  return (
    <div className="max-w-3xl">
      <AdminBreadcrumbs
        items={[
          { label: 'Pages', href: '/admin/pages' },
          { label: slug, href: `/admin/pages/${slug}` },
          { label: sectionKey },
        ]}
      />
      <h1 className="text-2xl font-medium">Edit section</h1>
      <p className="mt-2 text-sm text-title-muted">
        Structured JSONB — prefer property section editor pattern when page section
        types are finalized.
      </p>
      <form onSubmit={onSave} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <textarea
          rows={16}
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          className="w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
        {message && <p className="text-sm text-emerald-800">{message}</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save
        </button>
      </form>
    </div>
  )
}
