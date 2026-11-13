import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminHomeItemListEditor } from '../../components/admin/AdminHomeItemListEditor'
import { defaultHomeGalleryItems } from '../../config/homeContentDefaults'
import type { GallerySectionContent, HomeGalleryItem } from '../../domain/home/types'
import { loadGallerySection, saveGallerySection } from '../../lib/cms/homeSectionsApi'

export function AdminGalleryManagementPage() {
  const [content, setContent] = useState<GallerySectionContent>({
    eyebrow: 'Gallery',
    title: 'Architectural rhythm across developments',
  })
  const [items, setItems] = useState<HomeGalleryItem[]>([])
  const [sectionId, setSectionId] = useState('')
  const [published, setPublished] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadGallerySection().then((row) => {
      setContent(row)
      setItems(row.items.length ? row.items : [...defaultHomeGalleryItems])
      setSectionId(row.sectionId)
      setLoaded(true)
    })
  }, [])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      const payload = { ...content, items }
      const id = await saveGallerySection(payload, published, sectionId || undefined)
      setSectionId(id)
      setSaved(true)
      setDirty(false)
      setUploadError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  function seedDefaults() {
    if (!window.confirm('Load default gallery tiles into the editor? Save to publish.')) return
    setItems([...defaultHomeGalleryItems])
  }

  if (!loaded) return <p className="text-sm text-title-muted">Loading…</p>

  return (
    <div className="max-w-3xl">
      <AdminBreadcrumbs items={[{ label: 'Gallery management' }]} />
      <h1 className="text-2xl font-medium">Homepage gallery</h1>
      <p className="mt-2 text-sm text-title-muted">
        Masonry gallery on the homepage. Assign a column (1–3), category, and order. Unpublished
        items stay hidden on the live site.
      </p>
      <Link to="/#gallery" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline">
        Preview gallery section
      </Link>

      <form onSubmit={onSave} className="mt-8 space-y-6">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <label className="block text-sm">
            Eyebrow
            <input
              value={content.eyebrow ?? ''}
              onChange={(e) => {
                setContent((c) => ({ ...c, eyebrow: e.target.value }))
                setDirty(true)
                setSaved(false)
              }}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Section heading
            <input
              value={content.title ?? ''}
              onChange={(e) => {
                setContent((c) => ({ ...c, title: e.target.value }))
                setDirty(true)
                setSaved(false)
              }}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Intro (optional)
            <textarea
              rows={3}
              value={content.body ?? ''}
              onChange={(e) => {
                setContent((c) => ({ ...c, body: e.target.value }))
                setDirty(true)
                setSaved(false)
              }}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
        </div>

        {dirty && !saved ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            You have unsaved image or text changes. Click <strong>Save gallery</strong> below —
            uploads alone do not update the live homepage until you save.
          </p>
        ) : null}

        <AdminHomeItemListEditor
          items={items}
          onChange={(next) => {
            setItems(next)
            setDirty(true)
            setSaved(false)
          }}
          uploadFolder="pages/home/gallery"
          pageSectionId={sectionId || undefined}
          onUploadError={setUploadError}
          addLabel="Upload gallery image"
          renderExtraFields={(item, onPatch) => (
            <>
              <label className="block text-xs">
                Category / collection
                <input
                  value={item.category ?? ''}
                  onChange={(e) => onPatch({ category: e.target.value } as Partial<HomeGalleryItem>)}
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm"
                  placeholder="Facade, Interior, Aerial…"
                />
              </label>
              <label className="block text-xs">
                Column
                <select
                  value={item.column}
                  onChange={(e) =>
                    onPatch({ column: Number(e.target.value) } as Partial<HomeGalleryItem>)
                  }
                  className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm"
                >
                  <option value={0}>Column 1</option>
                  <option value={1}>Column 2</option>
                  <option value={2}>Column 3</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={Boolean(item.featured)}
                  onChange={(e) =>
                    onPatch({ featured: e.target.checked } as Partial<HomeGalleryItem>)
                  }
                />
                Feature image (editorial highlight)
              </label>
            </>
          )}
        />

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={seedDefaults} className="rounded-xl border border-border px-4 py-2 text-sm">
            Load default tiles
          </button>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Section published
          </label>
        </div>

        {uploadError && <p className="text-sm text-red-700">Upload: {uploadError}</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-emerald-800">Saved — refresh the homepage to verify.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save gallery
        </button>
      </form>
    </div>
  )
}
