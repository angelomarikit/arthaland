import { getStoragePublicUrl, getSupabaseClient } from '../supabase/client'
import {
  IMAGE_MAX_BYTES,
  IMAGE_MIME,
  VIDEO_MAX_BYTES,
  VIDEO_MIME,
} from '../supabase/config'
import type { DbCmsMedia } from '../supabase/database.types'

export type UploadProgress = {
  phase: 'idle' | 'optimizing' | 'uploading' | 'saving' | 'done' | 'error'
  percent: number
  message?: string
}

export type MediaUploadInput = {
  file: File
  bucket: 'arthaland-images' | 'arthaland-videos'
  folder: string
  developmentId?: string
  developmentSlug?: string
  unitTypeId?: string
  pageId?: string
  pageSectionId?: string
  placement?: string
  altText?: string
  published?: boolean
  displayOrder?: number
  isCover?: boolean
  isIllustrative?: boolean
  onProgress?: (p: UploadProgress) => void
}

function validateFile(file: File, bucket: 'arthaland-images' | 'arthaland-videos') {
  if (bucket === 'arthaland-images') {
    if (!IMAGE_MIME.includes(file.type as (typeof IMAGE_MIME)[number])) {
      throw new Error('Unsupported image type. Use JPEG, PNG, WebP, AVIF, or GIF.')
    }
    if (file.size > IMAGE_MAX_BYTES) {
      throw new Error('Image exceeds 15 MB limit.')
    }
  } else {
    if (!VIDEO_MIME.includes(file.type as (typeof VIDEO_MIME)[number])) {
      throw new Error('Unsupported video type. Use MP4, WebM, or MOV.')
    }
    if (file.size > VIDEO_MAX_BYTES) {
      throw new Error('Video exceeds 100 MB limit.')
    }
  }
}

async function maybeConvertToWebp(file: File): Promise<{ blob: Blob; ext: string }> {
  if (!file.type.startsWith('image/') || file.type === 'image/webp' || file.type === 'image/avif') {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    return { blob: file, ext }
  }
  if (typeof createImageBitmap === 'undefined') {
    const ext = file.type === 'image/jpeg' ? 'jpg' : 'png'
    return { blob: file, ext }
  }
  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return { blob: file, ext: 'jpg' }
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('WebP conversion failed'))),
        'image/webp',
        0.88,
      )
    })
    return { blob, ext: 'webp' }
  } catch {
    return { blob: file, ext: file.name.split('.').pop()?.toLowerCase() || 'jpg' }
  }
}

function buildStoragePath(folder: string, ext: string): string {
  const id = crypto.randomUUID()
  const segment = folder.replace(/^\/+|\/+$/g, '')
  return `${segment}/${id}.${ext}`
}

export async function uploadMediaWithMetadata(
  input: MediaUploadInput,
): Promise<DbCmsMedia> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  validateFile(input.file, input.bucket)
  input.onProgress?.({ phase: 'optimizing', percent: 10 })

  let body: Blob = input.file
  let ext = input.file.name.split('.').pop()?.toLowerCase() || 'bin'
  let mime = input.file.type

  if (input.bucket === 'arthaland-images') {
    const converted = await maybeConvertToWebp(input.file)
    body = converted.blob
    ext = converted.ext
    if (converted.ext === 'webp') mime = 'image/webp'
  }

  const storagePath = buildStoragePath(input.folder, ext)
  input.onProgress?.({ phase: 'uploading', percent: 40 })

  const { error: uploadError } = await supabase.storage
    .from(input.bucket)
    .upload(storagePath, body, {
      contentType: mime,
      upsert: false,
      cacheControl: '3600',
    })

  if (uploadError) {
    input.onProgress?.({ phase: 'error', percent: 0, message: uploadError.message })
    throw uploadError
  }

  input.onProgress?.({ phase: 'saving', percent: 75 })

  const mediaKind = input.bucket === 'arthaland-videos' ? 'video' : 'image'
  const row = {
    bucket_id: input.bucket,
    storage_path: storagePath,
    media_kind: mediaKind,
    mime_type: mime,
    byte_size: body.size,
    alt_text: input.altText ?? '',
    published: input.published ?? false,
    display_order: input.displayOrder ?? 0,
    development_id: input.developmentId ?? null,
    development_slug: input.developmentSlug ?? null,
    unit_type_id: input.unitTypeId ?? null,
    page_id: input.pageId ?? null,
    page_section_id: input.pageSectionId ?? null,
    placement: input.placement ?? null,
    is_cover: input.isCover ?? false,
    is_illustrative: input.isIllustrative ?? false,
  }

  const { data, error: insertError } = await supabase
    .from('cms_media')
    .insert(row)
    .select('*')
    .single()

  if (insertError) {
    await supabase.storage.from(input.bucket).remove([storagePath])
    input.onProgress?.({ phase: 'error', percent: 0, message: insertError.message })
    throw insertError
  }

  input.onProgress?.({ phase: 'done', percent: 100 })
  return data as DbCmsMedia
}

export async function deleteMediaIfUnreferenced(media: DbCmsMedia): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return

  const { count, error } = await supabase
    .from('cms_media')
    .select('*', { count: 'exact', head: true })
    .eq('storage_path', media.storage_path)

  if (error || (count ?? 0) > 1) return

  await supabase.storage.from(media.bucket_id).remove([media.storage_path])
  await supabase.from('cms_media').delete().eq('id', media.id)
}

export async function replaceDevelopmentHeroMedia(
  developmentId: string,
  developmentSlug: string,
  file: File,
  previousMediaId: string | null,
  onProgress?: (p: UploadProgress) => void,
): Promise<{ media: DbCmsMedia; publicUrl: string }> {
  const media = await uploadMediaWithMetadata({
    file,
    bucket: 'arthaland-images',
    folder: `developments/${developmentId}/hero`,
    developmentId,
    developmentSlug,
    placement: 'hero',
    published: true,
    isCover: false,
    onProgress,
  })

  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  const publicUrl = getStoragePublicUrl(media.bucket_id, media.storage_path)
  if (!publicUrl) throw new Error('Could not resolve public URL.')

  const { error: devError } = await supabase
    .from('developments')
    .update({
      hero_image: publicUrl,
      hero_media_id: media.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', developmentId)

  if (devError) {
    await supabase.storage.from(media.bucket_id).remove([media.storage_path])
    await supabase.from('cms_media').delete().eq('id', media.id)
    throw devError
  }

  if (previousMediaId) {
    const { data: prev } = await supabase
      .from('cms_media')
      .select('*')
      .eq('id', previousMediaId)
      .maybeSingle()
    if (prev) await deleteMediaIfUnreferenced(prev as DbCmsMedia)
  }

  return { media, publicUrl }
}

export function mediaPublicUrl(media: Pick<DbCmsMedia, 'bucket_id' | 'storage_path'>): string {
  return getStoragePublicUrl(media.bucket_id, media.storage_path) ?? ''
}
