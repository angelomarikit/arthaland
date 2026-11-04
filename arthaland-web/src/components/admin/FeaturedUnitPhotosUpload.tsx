import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import type { UploadProgress } from '../../lib/cms/mediaUpload'
import { mediaPublicUrl, uploadMediaWithMetadata } from '../../lib/cms/mediaUpload'

type FeaturedUnitPhotosUploadProps = {
  photos: string[]
  onChange: (photos: string[]) => void
  listingSlug: string
}

export function FeaturedUnitPhotosUpload({
  photos,
  onChange,
  listingSlug,
}: FeaturedUnitPhotosUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<UploadProgress>({ phase: 'idle', percent: 0 })
  const busy = progress.phase === 'optimizing' || progress.phase === 'uploading' || progress.phase === 'saving'

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return
    const files = [...fileList]
    const folder = `featured-units/${listingSlug || 'draft'}`
    const added: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!
      try {
        const media = await uploadMediaWithMetadata({
          file,
          bucket: 'arthaland-images',
          folder,
          placement: `gallery-${photos.length + i}`,
          published: true,
          onProgress: setProgress,
        })
        added.push(mediaPublicUrl(media))
      } catch {
        setProgress({ phase: 'error', percent: 0 })
        return
      }
    }
    setProgress({ phase: 'idle', percent: 0 })
    onChange([...photos, ...added])
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeAt(index: number) {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Unit photos</p>
          <p className="mt-1 text-xs text-title-muted">
            Upload multiple images — first photo is the main cover on the marketplace. Drag order:
            remove and re-add to change order (or we keep upload order).
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-ink/20 px-3 py-2 text-xs font-medium hover:border-ink/40 disabled:opacity-50"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Add photos
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {photos.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((url, index) => (
            <li key={`${url}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
              <img src={url} alt="" className="size-full object-cover" />
              {index === 0 && (
                <span className="text-[10px] absolute left-2 top-2 bg-ink/80 px-2 py-0.5 uppercase tracking-wider text-surface">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-2 top-2 flex size-8 items-center justify-center bg-ink/80 text-surface"
                aria-label="Remove photo"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-title-muted">No photos yet — add at least one for the listing.</p>
      )}
    </div>
  )
}
