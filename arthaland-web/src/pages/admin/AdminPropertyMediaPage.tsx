import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { MediaThumb, MediaUploadZone } from '../../components/admin/MediaUploadZone'
import {
  fetchAdminDevelopment,
  fetchDevelopmentMedia,
  updateDevelopment,
  updateMediaRow,
} from '../../lib/cms/developmentsApi'
import { uploadMediaWithMetadata, mediaPublicUrl } from '../../lib/cms/mediaUpload'
import type { DbCmsMedia } from '../../lib/supabase/database.types'

export function AdminPropertyMediaPage() {
  const { slug = '' } = useParams()
  const [devId, setDevId] = useState('')
  const [devName, setDevName] = useState('')
  const [media, setMedia] = useState<DbCmsMedia[]>([])
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    const dev = await fetchAdminDevelopment(slug)
    if (!dev) return
    setDevId(dev.id)
    setDevName(dev.name)
    setMedia(await fetchDevelopmentMedia(slug))
  }

  useEffect(() => {
    reload().catch((e: Error) => setError(e.message))
  }, [slug])

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: devName || slug, href: `/admin/properties/${slug}` },
          { label: 'Media' },
        ]}
      />
      <h1 className="text-2xl font-medium">Gallery & media</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6">
        <MediaUploadZone
          label="Add gallery image"
          accept="image"
          helperText="Drag and drop or upload — creates cms_media row after Storage succeeds."
          onUpload={async (file, onProgress) => {
            const order = media.length
            await uploadMediaWithMetadata({
              file,
              bucket: 'arthaland-images',
              folder: `developments/${devId}/gallery`,
              developmentId: devId,
              developmentSlug: slug,
              placement: 'gallery',
              displayOrder: order,
              published: true,
              onProgress,
            })
            await reload()
          }}
        />
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-[4/3] bg-surface-muted">
              <MediaThumb media={m} />
            </div>
            <div className="space-y-2 p-3 text-sm">
              <input
                defaultValue={m.alt_text ?? ''}
                placeholder="Alt text"
                className="w-full rounded-lg border border-border px-2 py-1 text-xs"
                onBlur={(e) =>
                  void updateMediaRow(m.id, { alt_text: e.target.value }).then(reload)
                }
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={() =>
                    void updateMediaRow(m.id, {
                      display_order: Math.max(0, m.display_order - 1),
                    }).then(reload)
                  }
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={() =>
                    void updateMediaRow(m.id, {
                      display_order: m.display_order + 1,
                    }).then(reload)
                  }
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={async () => {
                    const url = mediaPublicUrl(m)
                    await updateDevelopment(devId, {
                      cover_image: url,
                      card_image: url,
                    })
                    await updateMediaRow(m.id, { is_cover: true })
                    await reload()
                  }}
                >
                  Set as cover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
