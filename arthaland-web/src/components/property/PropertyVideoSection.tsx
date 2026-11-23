import type { Development } from '../../domain/development/types'
import type { PropertyVideoInfo } from '../../domain/propertyDetail/types'
import { Eyebrow } from '../ui/Eyebrow'

type PropertyVideoSectionProps = {
  development: Development
  video?: PropertyVideoInfo
}

export function PropertyVideoSection({ development, video }: PropertyVideoSectionProps) {
  const url = video?.url ?? development.videoUrl
  const poster = video?.poster ?? development.videoPoster
  if (!url) return null

  const isExternal = video?.source === 'external'

  return (
    <section className="py-16 md:py-24" id="video">
      <div className="section-x mx-auto max-w-[1200px] px-6">
        <Eyebrow>Project film</Eyebrow>
        <h2 className="text-heading-3 mt-4">Showcase video</h2>
        <p className="mt-3 max-w-xl text-sm text-title-muted">
          Project showcase — overview of the address and lifestyle (not a unit-specific
          walk-through unless noted).
        </p>
        <div className="relative mt-8 flex w-full justify-center bg-ink px-3 py-4 md:px-6 md:py-6">
          {isExternal ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[200px] w-full items-center justify-center text-surface underline"
            >
              Watch showcase video (opens in new tab)
            </a>
          ) : (
            <video
              src={url}
              poster={poster}
              controls
              playsInline
              className="mx-auto block h-auto max-h-[min(80svh,720px)] w-auto max-w-full object-contain object-center"
              preload="metadata"
            />
          )}
        </div>
      </div>
    </section>
  )
}
