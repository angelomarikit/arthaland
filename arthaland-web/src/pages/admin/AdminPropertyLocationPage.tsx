import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaUploadZone } from '../../components/admin/MediaUploadZone'
import { fetchAdminDevelopment, updateDevelopment } from '../../lib/cms/developmentsApi'
import { isGoogleMapsLink, parseLatLngFromGoogleMapsUrl } from '../../lib/maps/googleMaps'
import { uploadMediaWithMetadata, mediaPublicUrl } from '../../lib/cms/mediaUpload'
import type { DbDevelopment } from '../../lib/supabase/database.types'

function primaryMapsLink(dev: DbDevelopment): string {
  if (dev.directions_url && isGoogleMapsLink(dev.directions_url)) return dev.directions_url
  if (dev.map_url && isGoogleMapsLink(dev.map_url)) return dev.map_url
  return dev.directions_url ?? ''
}

export function AdminPropertyLocationPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    fetchAdminDevelopment(slug).then(setDev).catch((e: Error) => setError(e.message))
  }, [slug])

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
    const mapsLink = String(fd.get('google_maps_link') ?? '').trim()
    try {
      if (mapsLink && !isGoogleMapsLink(mapsLink)) {
        setError('Please paste a valid Google Maps link (e.g. maps.app.goo.gl/…).')
        return
      }
      let mapLat = fd.get('map_lat') ? Number(fd.get('map_lat')) : null
      let mapLng = fd.get('map_lng') ? Number(fd.get('map_lng')) : null
      if (mapsLink && (mapLat == null || mapLng == null)) {
        const fromUrl = parseLatLngFromGoogleMapsUrl(mapsLink)
        if (fromUrl) {
          mapLat = fromUrl.lat
          mapLng = fromUrl.lng
        }
      }

      const patch: Parameters<typeof updateDevelopment>[1] = {
        directions_url: mapsLink || null,
        map_lat: mapLat,
        map_lng: mapLng,
      }
      // Keep uploaded map image unless user is replacing with a maps link only
      if (mapsLink) {
        const keepImage =
          dev.map_url && !isGoogleMapsLink(dev.map_url)
            ? String(fd.get('keep_map_image') ?? '') === 'on'
            : false
        if (!keepImage && isGoogleMapsLink(dev.map_url ?? '')) {
          patch.map_url = null
        }
      }
      await updateDevelopment(dev.id, patch)
      setError(null)
      setSaved(true)
      setDev(await fetchAdminDevelopment(slug))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  if (!dev && !error) return <p className="text-sm text-title-muted">Loading…</p>
  if (!dev) return <p className="text-sm text-red-700">{error}</p>

  const mapsLinkDefault = primaryMapsLink(dev)
  const hasMapImage = Boolean(dev.map_url && !isGoogleMapsLink(dev.map_url))

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev.name, href: `/admin/properties/${slug}` },
          { label: 'Location' },
        ]}
      />
      <h1 className="text-2xl font-medium">Location & map</h1>
      <p className="mt-2 max-w-2xl text-sm text-title-muted">
        Paste a Google Maps share link from the app or browser — for example{' '}
        <code className="text-xs">https://maps.app.goo.gl/…</code>. The property page will show
        an embedded map and a &quot;Open in Google Maps&quot; button. Short{' '}
        <code className="text-xs">maps.app.goo.gl</code> links are supported; the embed uses your
        property location text unless you save latitude/longitude (advanced). For the sharpest pin,
        set <strong className="font-medium text-ink">VITE_GOOGLE_MAPS_EMBED_API_KEY</strong> in
        Vercel, or paste a full Maps URL that contains <code className="text-xs">@lat,lng</code>.
      </p>

      <form onSubmit={onSave} className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          Google Maps link
          <input
            name="google_maps_link"
            type="url"
            inputMode="url"
            placeholder="https://maps.app.goo.gl/eQAWcM7zHWDK4Ge96"
            defaultValue={mapsLinkDefault}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>

        {hasMapImage && (
          <label className="flex items-center gap-2 text-sm">
            <input name="keep_map_image" type="checkbox" defaultChecked />
            Keep static map image as fallback (optional)
          </label>
        )}

        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-emerald-800">Saved — check the public Location section.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save map link
        </button>
      </form>

      <button
        type="button"
        className="mt-6 text-sm text-title-muted underline"
        onClick={() => setShowAdvanced((v) => !v)}
      >
        {showAdvanced ? 'Hide' : 'Show'} coordinates & static map image
      </button>

      {showAdvanced && (
        <div className="mt-4 max-w-xl space-y-6">
          <form
            onSubmit={async (ev) => {
              ev.preventDefault()
              if (!dev) return
              const fd = new FormData(ev.currentTarget)
              await updateDevelopment(dev.id, {
                map_lat: fd.get('map_lat') ? Number(fd.get('map_lat')) : null,
                map_lng: fd.get('map_lng') ? Number(fd.get('map_lng')) : null,
              })
              setDev(await fetchAdminDevelopment(slug))
            }}
            className="space-y-4 rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-sm text-title-muted">
              Optional — improves embed when Google provides coordinates in the URL.
            </p>
            <label className="block text-sm">
              Latitude
              <input
                name="map_lat"
                type="number"
                step="any"
                defaultValue={dev.map_lat ?? ''}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Longitude
              <input
                name="map_lng"
                type="number"
                step="any"
                defaultValue={dev.map_lng ?? ''}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2"
              />
            </label>
            <button type="submit" className="rounded-xl border border-border px-4 py-2 text-sm">
              Save coordinates
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-medium">Static map image (optional)</h2>
            <p className="mt-1 text-xs text-title-muted">
              Used only if embed is unavailable — prefer the Google Maps link above.
            </p>
            {hasMapImage && (
              <img
                src={dev.map_url!}
                alt=""
                className="mt-4 aspect-[4/3] w-full max-w-md object-cover"
              />
            )}
            <MediaUploadZone
              label="Upload map screenshot"
              accept="image"
              onUpload={async (file, onProgress) => {
                const media = await uploadMediaWithMetadata({
                  file,
                  bucket: 'arthaland-images',
                  folder: `developments/${dev.id}/map`,
                  developmentId: dev.id,
                  developmentSlug: slug,
                  placement: 'gallery',
                  published: true,
                  displayOrder: 0,
                  onProgress,
                })
                await updateDevelopment(dev.id, { map_url: mediaPublicUrl(media) })
                setDev(await fetchAdminDevelopment(slug))
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
