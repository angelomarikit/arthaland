import { useCallback, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import type { UploadProgress } from '../../lib/cms/mediaUpload'
import { mediaPublicUrl } from '../../lib/cms/mediaUpload'
import type { DbCmsMedia } from '../../lib/supabase/database.types'

type MediaUploadZoneProps = {
  label: string
  accept: 'image' | 'video'
  previewUrl?: string | null
  onUpload: (file: File, onProgress: (p: UploadProgress) => void) => Promise<void>
  onRemove?: () => Promise<void>
  helperText?: string
}

export function MediaUploadZone({
  label,
  accept,
  previewUrl,
  onUpload,
  onRemove,
  helperText,
}: MediaUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<UploadProgress>({ phase: 'idle', percent: 0 })
  const [error, setError] = useState<string | null>(null)
  const busy = progress.phase === 'optimizing' || progress.phase === 'uploading' || progress.phase === 'saving'

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return
      setError(null)
      try {
        await onUpload(file, setProgress)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed')
        setProgress({ phase: 'error', percent: 0 })
      }
    },
    [onUpload],
  )

  const acceptAttr =
    accept === 'image' ? 'image/jpeg,image/png,image/webp,image/avif,image/gif' : 'video/mp4,video/webm,video/quicktime'

  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{label}</p>
          {helperText && <p className="mt-1 text-xs text-title-muted">{helperText}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-soft px-3 py-2 text-sm hover:border-ink/30 disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {previewUrl ? 'Replace' : 'Upload'}
          </button>
          {previewUrl && onRemove && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onRemove().catch((e) => setError(String(e)))}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm text-title-muted hover:text-ink"
            >
              <Trash2 className="size-4" />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {previewUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface-muted">
          {accept === 'video' ? (
            <video src={previewUrl} controls className="max-h-64 w-full" />
          ) : (
            <img src={previewUrl} alt="" className="max-h-64 w-full object-cover" />
          )}
        </div>
      )}

      {busy && (
        <p className="mt-3 text-xs text-title-muted">
          {progress.phase}… {progress.percent}%
        </p>
      )}
      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
      {progress.phase === 'done' && !error && (
        <p className="mt-3 text-xs text-emerald-800">Saved to Supabase.</p>
      )}
    </div>
  )
}

export function MediaThumb({ media }: { media: DbCmsMedia }) {
  const url = mediaPublicUrl(media)
  return (
    <img
      src={url}
      alt={media.alt_text ?? ''}
      className="size-full object-cover"
      loading="lazy"
    />
  )
}
