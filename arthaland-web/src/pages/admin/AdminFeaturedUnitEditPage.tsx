import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import type { FeaturedUnitStatus } from '../../domain/featuredUnit/types'
import {
  createFeaturedUnit,
  fetchAdminFeaturedUnit,
  updateFeaturedUnit,
  type FeaturedUnitInput,
} from '../../lib/cms/featuredUnitsApi'
import { mediaPublicUrl, uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function AdminFeaturedUnitEditPage() {
  const { id = '' } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [developmentName, setDevelopmentName] = useState('')
  const [location, setLocation] = useState('')
  const [unitLabel, setUnitLabel] = useState('')
  const [priceLabel, setPriceLabel] = useState('Price upon request')
  const [areaSqm, setAreaSqm] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [floor, setFloor] = useState('')
  const [description, setDescription] = useState('')
  const [highlightsText, setHighlightsText] = useState('')
  const [heroImage, setHeroImage] = useState('')
  const [galleryText, setGalleryText] = useState('')
  const [status, setStatus] = useState<FeaturedUnitStatus>('available')
  const [published, setPublished] = useState(false)
  const [displayOrder, setDisplayOrder] = useState(0)

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    fetchAdminFeaturedUnit(id)
      .then((u) => {
        if (!u) {
          setError('Listing not found')
          return
        }
        setSlug(u.slug)
        setTitle(u.title)
        setDevelopmentName(u.developmentName)
        setLocation(u.location)
        setUnitLabel(u.unitLabel)
        setPriceLabel(u.priceLabel)
        setAreaSqm(u.areaSqm != null ? String(u.areaSqm) : '')
        setBedrooms(u.bedrooms ?? '')
        setBathrooms(u.bathrooms ?? '')
        setFloor(u.floor ?? '')
        setDescription(u.description)
        setHighlightsText(u.highlights.join('\n'))
        setHeroImage(u.heroImage)
        setGalleryText(u.gallery.join('\n'))
        setStatus(u.status)
        setPublished(u.published)
        setDisplayOrder(u.displayOrder)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isNew])

  function buildInput(): FeaturedUnitInput {
    return {
      slug: slug || slugify(title),
      title,
      developmentName,
      location,
      unitLabel,
      priceLabel,
      areaSqm: areaSqm ? Number(areaSqm) : undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      floor: floor || undefined,
      description,
      highlights: highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      heroImage,
      gallery: galleryText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      status,
      published,
      displayOrder,
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const input = buildInput()
      if (isNew) {
        const newId = await createFeaturedUnit(input)
        setMessage('Created.')
        navigate(`/admin/featured-units/${newId}`, { replace: true })
      } else {
        await updateFeaturedUnit(id, input)
        setMessage('Saved.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-title-muted">Loading…</p>
  }

  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: 'Featured units', href: '/admin/featured-units' },
          { label: isNew ? 'New listing' : title || 'Edit' },
        ]}
      />
      <h1 className="text-2xl font-medium">{isNew ? 'New featured unit' : 'Edit listing'}</h1>
      <p className="mt-2 text-sm text-title-muted">
        Published listings appear on the public marketplace. Use clear photos and verified pricing
        language.
      </p>

      <form onSubmit={onSave} className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Listing title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (!slug && title) setSlug(slugify(title))
            }}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            required
          />
        </label>
        <label className="block text-sm">
          URL slug
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
            required
          />
        </label>
        <label className="block text-sm">
          Development name
          <input
            value={developmentName}
            onChange={(e) => setDevelopmentName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            required
          />
        </label>
        <label className="block text-sm">
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Unit type label
            <input
              value={unitLabel}
              onChange={(e) => setUnitLabel(e.target.value)}
              placeholder="e.g. 2 Bedroom corner"
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Price label
            <input
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            Area (sqm)
            <input
              value={areaSqm}
              onChange={(e) => setAreaSqm(e.target.value)}
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Bedrooms
            <input
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Bathrooms
            <input
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
        </div>
        <label className="block text-sm">
          Floor (optional)
          <input
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Description
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm leading-relaxed"
            required
          />
        </label>
        <label className="block text-sm">
          Highlights (one per line)
          <textarea
            rows={3}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </label>

        <MediaUploadZone
          label="Cover photo"
          accept="image"
          previewUrl={heroImage || undefined}
          helperText="Main marketplace image."
          onUpload={async (file, onProgress) => {
            const media = await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: 'featured-units',
              placement: 'hero',
              published: true,
              onProgress,
            })
            setHeroImage(mediaPublicUrl(media))
          }}
        />

        <label className="block text-sm">
          Gallery image URLs (one per line)
          <textarea
            rows={3}
            value={galleryText}
            onChange={(e) => setGalleryText(e.target.value)}
            placeholder="Add extra photos after upload, or paste URLs"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FeaturedUnitStatus)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </label>
          <label className="block text-sm">
            Sort order
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published on website
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-emerald-800">{message}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-ink px-5 py-2.5 text-sm text-surface disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save listing'}
          </button>
          <Link to="/admin/featured-units" className="rounded-xl border border-border px-5 py-2.5 text-sm">
            Back
          </Link>
        </div>
      </form>
    </div>
  )
}
