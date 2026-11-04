import { FadeInWhenVisible } from '../page/FadeInWhenVisible'
import { Eyebrow } from '../ui/Eyebrow'

type CertificationStandardBlockProps = {
  id: string
  number: string
  name: string
  fullName: string
  tagline: string
  intro: string
  focusTitle: string
  focusItems: readonly { title: string; body: string }[]
  whyTitle: string
  whyBody: readonly string[]
  pullQuote: string
  logo: { src: string; alt: string }
  reverse?: boolean
}

export function CertificationStandardBlock({
  id,
  number,
  name,
  fullName,
  tagline,
  intro,
  focusTitle,
  focusItems,
  whyTitle,
  whyBody,
  pullQuote,
  logo,
  reverse = false,
}: CertificationStandardBlockProps) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-16 md:py-24">
      <div
        className={`section-x mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-12 lg:gap-16 ${reverse ? 'lg:[direction:rtl]' : ''}`}
      >
        <FadeInWhenVisible className={`lg:col-span-5 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
          <div className="flex min-h-[200px] items-center justify-center border border-border bg-surface-soft p-8 md:min-h-[260px] md:p-12">
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-[min(28vw,220px)] w-full max-w-[420px] object-contain"
              loading="lazy"
            />
          </div>
        </FadeInWhenVisible>

        <div className={`lg:col-span-7 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
          <FadeInWhenVisible>
            <Eyebrow>{`${number} — ${name}`}</Eyebrow>
            <h2 className="text-heading-2 mt-4">{fullName}</h2>
            <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-ink">{tagline}</p>
            <p className="mt-6 leading-relaxed text-title-muted">{intro}</p>
          </FadeInWhenVisible>

          <FadeInWhenVisible className="mt-10">
            <h3 className="text-heading-3">{focusTitle}</h3>
            <ul className="mt-6 space-y-4">
              {focusItems.map((item) => (
                <li
                  key={item.title}
                  className="border border-border bg-surface-soft px-5 py-4 md:px-6 md:py-5"
                >
                  <p className="font-medium tracking-[-0.02em]">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-title-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </FadeInWhenVisible>

          <FadeInWhenVisible className="mt-10">
            <h3 className="text-heading-3">{whyTitle}</h3>
            {whyBody.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-title-muted">
                {paragraph}
              </p>
            ))}
            <blockquote className="mt-8 border-l-2 border-accent-deep pl-5 text-lg font-medium tracking-[-0.02em] text-ink">
              {pullQuote}
            </blockquote>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  )
}
