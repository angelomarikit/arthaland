import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminHomeItemListEditor } from '../../components/admin/AdminHomeItemListEditor'
import { defaultHomeLifestyleItems } from '../../config/homeContentDefaults'
import type { HomeLifestyleItem, LifestyleSectionContent } from '../../domain/home/types'
import { loadLifestyleSection, saveLifestyleSection } from '../../lib/cms/homeSectionsApi'

export function AdminLifestyleManagementPage() {
  const [content, setContent] = useState<LifestyleSectionContent>({})
  const [items, setItems] = useState<HomeLifestyleItem[]>([])
  const [sectionId, setSectionId] = useState('')
  const [published, setPublished] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLifestyleSection().then((row) => {
      setContent(row)
      setItems(row.items.length ? row.items : [...defaultHomeLifestyleItems])
      setSectionId(row.sectionId)
    })
  }, [])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    try {
      const id = await saveLifestyleSection({ ...content, items }, published, sectionId || undefined)
      setSectionId(id)
      setSaved(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <div className="max-w-3xl">
      <AdminBreadcrumbs items={[{ label: 'Lifestyle management' }]} />
      <h1 className="text-2xl font-medium">Homepage lifestyle</h1>
      <p className="mt-2 text-sm text-title-muted">
        Editorial lifestyle grid below sustainability on the homepage.
      </p>
      <Link to="/#lifestyle" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline">
        Preview lifestyle section
      </Link>

      <form onSubmit={onSave} className="mt-8 space-y-6">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <label className="block text-sm">
            Eyebrow
            <input
              value={content.eyebrow ?? ''}
              onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Heading
            <textarea
              rows={2}
              value={content.title ?? ''}
              onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Body
            <textarea
              rows={4}
              value={content.body ?? ''}
              onChange={(e) => setContent((c) => ({ ...c, body: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
        </div>

        <AdminHomeItemListEditor
          items={items}
          onChange={setItems}
          uploadFolder="pages/home/lifestyle"
          addLabel="Upload lifestyle image"
          renderExtraFields={(item, onPatch) => (
            <label className="block text-xs">
              Layout
              <select
                value={item.layout}
                onChange={(e) =>
                  onPatch({
                    layout: e.target.value as HomeLifestyleItem['layout'],
                  })
                }
                className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm"
              >
                <option value="large">Large tile</option>
                <option value="standard">Standard tile</option>
              </select>
            </label>
          )}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Section published
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-emerald-800">Saved to CMS.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save lifestyle section
        </button>
      </form>
    </div>
  )
}
