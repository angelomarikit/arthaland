import { useRef, useState, type ReactNode } from 'react'
import { MediaUploadZone } from './MediaUploadZone'
import {
  deleteCmsMediaById,
  mediaPublicUrl,
  uploadMediaWithMetadata,
  type UploadProgress,
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
  pageSectionId?: string
  renderExtraFields?: (item: T, onPatch: (patch: Partial<T>) => void) => ReactNode
  addLabel?: string
  onUploadError?: (message: string | null) => void
}

export function AdminHomeItemListEditor<T extends ItemBase>({
  items,
  onChange,
  uploadFolder,
  pageSectionId,
  renderExtraFields,
  addLabel = 'Add image',
  onUploadError,
}: AdminHomeItemListEditorProps<T>) {
  const itemsRef = useRef(items)
  itemsRef.current = items

  const [replacingId, setReplacingId] = useState<string | null>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const replaceTargetRef = useRef<T | null>(null)

  function setItems(next: T[]) {
    itemsRef.current = next
    onChange(next)
  }

  function patchItem(id: string, patch: Partial<T>) {
    setItems(itemsRef.current.map((it) => (it.id === id ? { ...it, ...patch } : it)))
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
      setItems(itemsRef.current.filter((i) => i.id !== item.id))
    })()
  }

  function move(id: string, dir: -1 | 1) {
    const sorted = [...itemsRef.current].sort((a, b) => a.displayOrder - b.displayOrder)
    const idx = sorted.findIndex((i) => i.id === id)
    const swap = sorted[idx + dir]
    if (!sorted[idx] || !swap) return
    const aOrder = sorted[idx].displayOrder
    patchItem(sorted[idx].id, { displayOrder: swap.displayOrder } as Partial<T>)
    patchItem(swap.id, { displayOrder: aOrder } as Partial<T>)
  }

  async function uploadForItem(
    file: File,
    onProgress: (p: UploadProgress) => void,
    mode: 'add' | 'replace',
    existing?: T,
  ) {
    onUploadError?.(null)
    const media = await uploadMediaWithMetadata({
      file,
      bucket: 'arthaland-images',
      folder: uploadFolder,
      pageSectionId,
      placement: 'home-section',
      published: true,
      displayOrder: mode === 'add' ? itemsRef.current.length : existing?.displayOrder,
      onProgress,
    })

    if (mode === 'add') {
      const next = {
        id: crypto.randomUUID(),
        imageUrl: mediaPublicUrl(media),
        caption: 'New photo',
        displayOrder: itemsRef.current.length,
        published: true,
        mediaId: media.id,
      } as T
      setItems([...itemsRef.current, next])
      return
    }

    if (!existing) return

    const previousMediaId = existing.mediaId
    patchItem(existing.id, {
      imageUrl: mediaPublicUrl(media),
      mediaId: media.id,
    } as Partial<T>)

    if (previousMediaId && previousMediaId !== media.id) {
      try {
        await deleteCmsMediaById(previousMediaId)
      } catch {
        /* previous file may still be referenced elsewhere */
      }
    }
  }

  async function runReplace(file: File) {
    const existing = replaceTargetRef.current
    if (!existing) return
    setReplacingId(existing.id)
    try {
      await uploadForItem(file, () => undefined, 'replace', existing)
    } catch (e) {
      onUploadError?.(e instanceof Error ? e.message : 'Image upload failed')
    } finally {
      setReplacingId(null)
      replaceTargetRef.current = null
    }
  }

  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="space-y-4">
      <MediaUploadZone
        label={addLabel}
        accept="image"
        helperText="Upload finishes in the browser — then click Save gallery (or Save lifestyle) so the homepage updates."
        onUpload={async (file, onProgress) => {
          try {
            await uploadForItem(file, onProgress, 'add')
          } catch (e) {
            onUploadError?.(e instanceof Error ? e.message : 'Image upload failed')
            throw e
          }
        }}
      />

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void runReplace(file)
          e.target.value = ''
        }}
      />

      <ul className="space-y-4">
        {sorted.map((item) => (
          <li key={item.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex gap-4">
              <img
                src={item.imageUrl}
                alt=""
                className="aspect-[4/5] w-24 shrink-0 object-cover object-center"
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
                  <button
                    type="button"
                    disabled={replacingId === item.id}
                    className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-50"
                    onClick={() => {
                      replaceTargetRef.current = item
                      replaceInputRef.current?.click()
                    }}
                  >
                    {replacingId === item.id ? 'Uploading…' : 'Replace image'}
                  </button>
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
