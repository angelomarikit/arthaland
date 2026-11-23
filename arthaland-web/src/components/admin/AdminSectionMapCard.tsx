import { Link } from 'react-router-dom'
import type { AdminSectionLink } from '../../config/adminContentMap'

export function AdminSectionMapCard({ section }: { section: AdminSectionLink }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <SectionMapHeader section={section} />
      <p className="mt-3 text-sm leading-relaxed text-title-muted">{section.help}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={section.editHref}
          className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-surface"
        >
          Edit section
        </Link>
        {section.previewHref ? (
          <Link
            to={section.previewHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs"
          >
            Preview on site
          </Link>
        ) : null}
      </div>
    </article>
  )
}

function SectionMapHeader({ section }: { section: AdminSectionLink }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-title-muted">
        On the page
      </p>
      <h3 className="mt-1 font-medium">{section.publicLabel}</h3>
      <p className="text-xs text-title-muted">{section.label}</p>
    </div>
  )
}