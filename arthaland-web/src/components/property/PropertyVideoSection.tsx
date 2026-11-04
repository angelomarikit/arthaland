import type { Development } from '../../domain/development/types'
import { Eyebrow } from '../ui/Eyebrow'

type PropertyVideoSectionProps = {
  development: Development
}

export function PropertyVideoSection({ development }: PropertyVideoSectionProps) {
  if (!development.videoUrl) return null

  return (
    <section className="py-16 md:py-24">
      <div className="section-x mx-auto max-w-[1200px] px-6">
        <Eyebrow>Project film</Eyebrow>
        <h2 className="text-heading-3 mt-4">Showcase video</h2>
        <p className="mt-3 max-w-xl text-sm text-title-muted">
          Presented as a project showcase — not a continuous walkthrough of a
          specific unit unless noted on the official source.
        </p>
        <div className="relative mt-8 aspect-video overflow-hidden bg-ink">
          <video
            src={development.videoUrl}
            poster={development.videoPoster}
            controls
            className="size-full object-cover"
            preload="metadata"
          />
        </div>
      </div>
    </section>
  )
}
