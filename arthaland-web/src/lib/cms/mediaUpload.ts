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

/** Upload many images sequentially — each file gets its own Storage path + cms_media row. */
export async function uploadMediaBatch(
  files: File[],
  buildInput: (file: File, index: number) => Omit<MediaUploadInput, 'file' | 'onProgress'>,
  onProgress?: (p: UploadProgress) => void,
): Promise<DbCmsMedia[]> {
  const results: DbCmsMedia[] = []
  const n = files.length
  if (n === 0) return results

  for (let i = 0; i < n; i++) {
    const file = files[i]!
    const partial = buildInput(file, i)
    const media = await uploadMediaWithMetadata({
      ...partial,
      file,
      onProgress: (p) => {
        if (!onProgress) return
        const segmentStart = (i / n) * 100
        const segmentWeight = 100 / n
        const scaled = Math.round(segmentStart + (p.percent / 100) * segmentWeight)
        onProgress({ ...p, percent: Math.min(99, scaled) })
      },
    })
    results.push(media)
  }
  onProgress?.({ phase: 'done', percent: 100 })
  return results
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

export async function forceDeleteCmsMedia(media: DbCmsMedia): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return
  await supabase.storage.from(media.bucket_id).remove([media.storage_path])
  await supabase.from('cms_media').delete().eq('id', media.id)
}

async function deleteCmsMediaByPlacement(developmentId: string, placement: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return
  const { data: rows } = await supabase
    .from('cms_media')
    .select('*')
    .eq('development_id', developmentId)
    .eq('placement', placement)
  for (const row of rows ?? []) {
    await forceDeleteCmsMedia(row as DbCmsMedia)
  }
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

export async function replaceDevelopmentShowcaseVideo(
  developmentId: string,
  developmentSlug: string,
  file: File,
  onProgress?: (p: UploadProgress) => void,
): Promise<{ media: DbCmsMedia; publicUrl: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  await deleteCmsMediaByPlacement(developmentId, 'showcase_video')

  const media = await uploadMediaWithMetadata({
    file,
    bucket: 'arthaland-videos',
    folder: `developments/${developmentId}/showcase`,
    developmentId,
    developmentSlug,
    placement: 'showcase_video',
    published: true,
    onProgress,
  })

  const publicUrl = getStoragePublicUrl(media.bucket_id, media.storage_path)
  if (!publicUrl) throw new Error('Could not resolve public URL.')

  const { error: devError } = await supabase
    .from('developments')
    .update({
      video_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', developmentId)

  if (devError) {
    await forceDeleteCmsMedia(media)
    throw devError
  }

  return { media, publicUrl }
}

export async function replaceDevelopmentShowcaseVideoPoster(
  developmentId: string,
  developmentSlug: string,
  file: File,
  onProgress?: (p: UploadProgress) => void,
): Promise<{ media: DbCmsMedia; publicUrl: string }> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: existingPoster } = await supabase
    .from('cms_media')
    .select('*')
    .eq('development_id', developmentId)
    .eq('placement', 'showcase_video_poster')
    .maybeSingle()

  if (existingPoster) {
    await forceDeleteCmsMedia(existingPoster as DbCmsMedia)
  }

  const media = await uploadMediaWithMetadata({
    file,
    bucket: 'arthaland-images',
    folder: `developments/${developmentId}/showcase`,
    developmentId,
    developmentSlug,
    placement: 'showcase_video_poster',
    published: true,
    onProgress,
  })

  const publicUrl = getStoragePublicUrl(media.bucket_id, media.storage_path)
  if (!publicUrl) throw new Error('Could not resolve public URL.')

  const { error: devError } = await supabase
    .from('developments')
    .update({
      video_poster: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', developmentId)

  if (devError) {
    await forceDeleteCmsMedia(media)
    throw devError
  }

  return { media, publicUrl }
}

export async function clearDevelopmentShowcaseVideo(developmentId: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  await deleteCmsMediaByPlacement(developmentId, 'showcase_video')
  await deleteCmsMediaByPlacement(developmentId, 'showcase_video_poster')
  const { error } = await supabase
    .from('developments')
    .update({
      video_url: null,
      video_poster: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', developmentId)
  if (error) throw error
}

export async function clearDevelopmentShowcaseVideoPosterOnly(developmentId: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  await deleteCmsMediaByPlacement(developmentId, 'showcase_video_poster')
  const { error } = await supabase
    .from('developments')
    .update({
      video_poster: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', developmentId)
  if (error) throw error
}

export function mediaPublicUrl(media: Pick<DbCmsMedia, 'bucket_id' | 'storage_path'>): string {
  return getStoragePublicUrl(media.bucket_id, media.storage_path) ?? ''
}
