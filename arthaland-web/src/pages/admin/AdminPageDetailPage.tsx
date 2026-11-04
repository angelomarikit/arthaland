import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import {
  formatSectionPreview,
  getLivePageSections,
  type LivePageSection,
} from '../../config/pageContentRegistry'
import { fetchPageSections } from '../../lib/cms/pagesApi'
import type { DbPageSection } from '../../lib/supabase/database.types'

type MergedSection = LivePageSection & {
  db?: DbPageSection
  onWebsitePreview: string
}

function mergeSections(pageSlug: string, dbRows: DbPageSection[]): MergedSection[] {
  const live = getLivePageSections(pageSlug)
  if (live.length === 0) {
    return dbRows.map((s) => ({
      sectionKey: s.section_key,
      label: s.section_key.replace(/-/g, ' '),
      sectionType: s.section_type,
      displayOrder: s.display_order,
      content: (s.content as LivePageSection['content']) ?? {},
      db: s,
      onWebsitePreview: formatSectionPreview(
        (s.content as LivePageSection['content']) ?? {},
      ),
    }))
  }

  return live.map((section) => {
    const db = dbRows.find((r) => r.section_key === section.sectionKey)
    const cmsContent = db?.content as LivePageSection['content'] | undefined
    return {
      ...section,
      db,
      onWebsitePreview: formatSectionPreview(section.content),
      content: cmsContent?.title ? { ...section.content, ...cmsContent } : section.content,
    }
  })
}

export function AdminPageDetailPage() {
  const { slug = '' } = useParams()
  const [dbSections, setDbSections] = useState<DbPageSection[]>([])

  useEffect(() => {
    fetchPageSections(slug).then(setDbSections)
  }, [slug])

  const sections = useMemo(() => mergeSections(slug, dbSections), [slug, dbSections])

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Pages', href: '/admin/pages' },
          { label: slug.replace(/-/g, ' ') },
        ]}
      />
      <h1 className="text-2xl font-medium capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-title-muted">
        Each row is a block on the public page. The gray box shows the{' '}
        <strong className="font-medium text-ink">words visitors see today</strong>.
        Use <strong className="font-medium text-ink">Edit content</strong> to prepare
        updated copy in the CMS (your developer connects saved sections to the live site
        over time).
      </p>

      <ul className="mt-8 space-y-4">
        {sections.map((s) => (
          <li
            key={s.sectionKey}
            className="rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium capitalize">{s.label}</p>
                {s.note ? (
                  <p className="mt-1 text-xs text-title-muted">{s.note}</p>
                ) : null}
                <div className="mt-3 rounded-xl bg-surface-soft px-4 py-3 text-sm leading-relaxed text-ink">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-title-muted">
                    On the website now
                  </p>
                  <p className="mt-2">{s.onWebsitePreview}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-xs text-title-muted">
                  {s.db?.published ? 'CMS: published' : 'CMS: not saved yet'}
                </span>
                <Link
                  to={`/admin/pages/${slug}/sections/${s.sectionKey}`}
                  className="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-medium hover:border-ink/40"
                >
                  Edit content
                </Link>
              </div>
            </div>
          </li>
        ))}
        {sections.length === 0 && (
          <li className="rounded-xl border border-dashed border-border bg-surface-soft px-4 py-6 text-sm text-title-muted">
            No sections are defined for this page in the site map yet.
          </li>
        )}
      </ul>

      <p className="mt-8 text-sm text-title-muted">
        Photos for each block:{' '}
        <Link to="/admin/site-images" className="underline">
          Where images appear
        </Link>
        . Property pages:{' '}
        <Link to="/admin/properties" className="underline">
          All Developments
        </Link>
        .
      </p>
    </div>
  )
}
