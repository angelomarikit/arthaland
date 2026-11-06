import { useCallback, useRef, useState, type DragEvent } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import type { UploadProgress } from '../../lib/cms/mediaUpload'
import { mediaPublicUrl } from '../../lib/cms/mediaUpload'
import type { DbCmsMedia } from '../../lib/supabase/database.types'

type MediaUploadZoneBase = {
  label: string
  accept: 'image' | 'video'
  previewUrl?: string | null
  onRemove?: () => Promise<void>
  helperText?: string
  /** Allow selecting many files at once (also enables drag-and-drop of multiple). */
  multiple?: boolean
}

type MediaUploadZoneSingle = MediaUploadZoneBase & {
  multiple?: false
  onUpload: (file: File, onProgress: (p: UploadProgress) => void) => Promise<void>
}

type MediaUploadZoneBulk = MediaUploadZoneBase & {
  multiple: true
  onUpload: (files: File[], onProgress: (p: UploadProgress) => void) => Promise<void>
}

type MediaUploadZoneProps = MediaUploadZoneSingle | MediaUploadZoneBulk

export function MediaUploadZone(props: MediaUploadZoneProps) {
  const {
    label,
    accept,
    previewUrl,
    onRemove,
    helperText,
    multiple = false,
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<UploadProgress>({ phase: 'idle', percent: 0 })
  const [error, setError] = useState<string | null>(null)
  const busy = progress.phase === 'optimizing' || progress.phase === 'uploading' || progress.phase === 'saving'
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return
      setError(null)
      try {
        if (multiple) {
          const list = [...files]
          await (props as MediaUploadZoneBulk).onUpload(list, setProgress)
        } else {
          const file = files[0]
          if (!file) return
          await (props as MediaUploadZoneSingle).onUpload(file, setProgress)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed')
        setProgress({ phase: 'error', percent: 0 })
      }
    },
    [multiple, props],
  )

  const acceptAttr =
    accept === 'image' ? 'image/jpeg,image/png,image/webp,image/avif,image/gif' : 'video/mp4,video/webm,video/quicktime'

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!busy) setDragActive(true)
  }
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (busy) return
    void handleFiles(e.dataTransfer.files)
  }

  const buttonLabel = previewUrl ? 'Replace' : multiple ? 'Upload images' : 'Upload'

  return (
    <div
      className={`rounded-2xl border border-dashed bg-surface p-4 transition-colors ${
        dragActive ? 'border-ink/40 bg-surface-soft' : 'border-border'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
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
            {buttonLabel}
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
        multiple={multiple}
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
