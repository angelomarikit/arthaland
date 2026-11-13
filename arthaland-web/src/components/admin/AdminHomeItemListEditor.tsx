import type { ReactNode } from 'react'
import {
  deleteCmsMediaById,
  mediaPublicUrl,
  uploadMediaWithMetadata,
} from '../../lib/cms/mediaUpload'

type ItemBase = {
  id: string
  imageUrl: string
  caption: string
  displayOrder: number
  published: boolean
  mediaId?: string
}

type AdminHomeItemListEditorProps<T extends ItemBase> = {
  items: T[]
  onChange: (items: T[]) => void
  uploadFolder: string
  renderExtraFields?: (item: T, onPatch: (patch: Partial<T>) => void) => ReactNode
  addLabel?: string
}

export function AdminHomeItemListEditor<T extends ItemBase>({
  items,
  onChange,
  uploadFolder,
  renderExtraFields,
  addLabel = 'Add image',
}: AdminHomeItemListEditorProps<T>) {
  function patchItem(id: string, patch: Partial<T>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function removeItem(item: T) {
    if (!window.confirm('Delete this item from the homepage section?')) return
    void (async () => {
      if (item.mediaId) {
        try {
          await deleteCmsMediaById(item.mediaId)
        } catch {
          /* storage row may already be gone */
        }
      }
      onChange(items.filter((i) => i.id !== item.id))
    })()
  }

  function move(id: string, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder)
    const idx = sorted.findIndex((i) => i.id === id)
    const swap = sorted[idx + dir]
    if (!sorted[idx] || !swap) return
    const aOrder = sorted[idx].displayOrder
    patchItem(sorted[idx].id, { displayOrder: swap.displayOrder } as Partial<T>)
    patchItem(swap.id, { displayOrder: aOrder } as Partial<T>)
  }

  async function addItem(file: File, onProgress: (p: { percent: number }) => void) {
    const media = await uploadMediaWithMetadata({
      file,
      bucket: 'arthaland-images',
      folder: uploadFolder,
      placement: 'home-section',
      published: true,
      displayOrder: items.length,
      onProgress,
    })
    const next = {
      id: crypto.randomUUID(),
      imageUrl: mediaPublicUrl(media),
      caption: 'New photo',
      displayOrder: items.length,
      published: true,
      mediaId: media.id,
    } as T
    onChange([...items, next])
  }

  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed border-border bg-surface-soft p-4">
        <label className="text-sm font-medium">{addLabel}</label>
        <input
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void addItem(file, () => undefined)
            e.target.value = ''
          }}
        />
      </div>

      <ul className="space-y-4">
        {sorted.map((item) => (
          <li key={item.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex gap-4">
              <img
                src={item.imageUrl}
                alt=""
                className="aspect-[4/5] w-24 shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <label className="block text-xs">
                  Caption
                  <input
                    value={item.caption}
                    onChange={(e) => patchItem(item.id, { caption: e.target.value } as Partial<T>)}
                    className="mt-1 w-full rounded-lg border border-border px-2 py-1 text-sm"
                  />
                </label>
                {renderExtraFields?.(item, (patch) => patchItem(item.id, patch))}
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(e) =>
                      patchItem(item.id, { published: e.target.checked } as Partial<T>)
                    }
                  />
                  Published on site
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                    onClick={() => move(item.id, -1)}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                    onClick={() => move(item.id, 1)}
                  >
                    Move down
                  </button>
                  <label className="rounded-lg border border-border px-2 py-1 text-xs cursor-pointer">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        void uploadMediaWithMetadata({
                          file,
                          bucket: 'arthaland-images',
                          folder: uploadFolder,
                          placement: 'home-section',
                          published: true,
                          onProgress: () => undefined,
                        }).then((media) => {
                          patchItem(item.id, {
                            imageUrl: mediaPublicUrl(media),
                            mediaId: media.id,
                          } as Partial<T>)
                        })
                        e.target.value = ''
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-800"
                    onClick={() => removeItem(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
