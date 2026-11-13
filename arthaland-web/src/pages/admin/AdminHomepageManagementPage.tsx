import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import type { HeroSectionContent } from '../../domain/home/types'
import { loadHeroSection, saveHeroSection } from '../../lib/cms/homeSectionsApi'
import { mediaPublicUrl, uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'

const POSITION_PRESETS: { label: string; value: string }[] = [
  { label: 'Center (default)', value: 'center center' },
  { label: 'Upper third', value: 'center 35%' },
  { label: 'Lower third', value: 'center 65%' },
  { label: 'Top', value: 'center top' },
  { label: 'Bottom', value: 'center bottom' },
]

export function AdminHomepageManagementPage() {
  const [content, setContent] = useState<HeroSectionContent>({})
  const [sectionId, setSectionId] = useState('')
  const [published, setPublished] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHeroSection().then(({ content: hero, sectionId: id }) => {
      setContent(hero)
      setSectionId(id)
    })
  }, [])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      const id = await saveHeroSection(content, published, sectionId || undefined)
      setSectionId(id)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const posterPosition = content.posterObjectPosition ?? 'center center'

  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs
        items={[{ label: 'Homepage management' }]}
      />
      <h1 className="text-2xl font-medium">Homepage — hero</h1>
      <p className="mt-2 text-sm text-title-muted">
        Control the top video, poster still, headline copy, and how the image is framed
        (object position). Changes go live on the homepage after you save.
      </p>
      <Link to="/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline">
        Preview homepage
      </Link>

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
          Headline (use line breaks for two lines)
          <textarea
            rows={2}
            value={content.title ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Subheading
          <textarea
            rows={3}
            value={content.subtitle ?? ''}
            onChange={(e) => setContent((c) => ({ ...c, subtitle: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          Image / video framing
          <select
            value={POSITION_PRESETS.find((p) => p.value === posterPosition)?.value ?? 'custom'}
            onChange={(e) => {
              const val = e.target.value
              if (val !== 'custom') {
                setContent((c) => ({
                  ...c,
                  posterObjectPosition: val,
                  videoObjectPosition: val,
                }))
              }
            }}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          >
            {POSITION_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
            <option value="custom">Custom…</option>
          </select>
        </label>
        <label className="block text-sm">
          Custom object-position
          <input
            value={content.posterObjectPosition ?? ''}
            onChange={(e) =>
              setContent((c) => ({
                ...c,
                posterObjectPosition: e.target.value,
                videoObjectPosition: e.target.value,
              }))
            }
            placeholder="center center"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
          />
        </label>

        <MediaUploadZone
          label="Hero poster image"
          accept="image"
          previewUrl={content.posterImageUrl}
          helperText="Shown while video loads and when reduced-motion is on."
          onUpload={async (file, onProgress) => {
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: 'pages/home/hero',
              placement: 'hero',
              published: true,
              onProgress,
            })
            setContent((c) => ({ ...c, posterImageUrl: mediaPublicUrl(media) }))
          }}
        />

        <MediaUploadZone
          label="Desktop hero video (MP4)"
          accept="video"
          onUpload={async (file, onProgress) => {
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-videos',
              folder: 'pages/home/hero',
              placement: 'hero',
              published: true,
              onProgress,
            })
            setContent((c) => ({ ...c, videoDesktopUrl: mediaPublicUrl(media) }))
          }}
        />

        <MediaUploadZone
          label="Mobile hero video (MP4)"
          accept="video"
          onUpload={async (file, onProgress) => {
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-videos',
              folder: 'pages/home/hero',
              placement: 'hero',
              published: true,
              onProgress,
            })
            setContent((c) => ({ ...c, videoMobileUrl: mediaPublicUrl(media) }))
          }}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-emerald-800">Saved to CMS.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save homepage hero
        </button>
      </form>
    </div>
  )
}
