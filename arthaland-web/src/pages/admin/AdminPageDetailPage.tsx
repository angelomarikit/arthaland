import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchPageSections } from '../../lib/cms/pagesApi'
import type { DbPageSection } from '../../lib/supabase/database.types'

export function AdminPageDetailPage() {
  const { slug = '' } = useParams()
  const [sections, setSections] = useState<DbPageSection[]>([])

  useEffect(() => {
    fetchPageSections(slug).then(setSections)
  }, [slug])

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Pages', href: '/admin/pages' },
          { label: slug },
        ]}
      />
      <h1 className="text-2xl font-medium capitalize">{slug} sections</h1>
      <p className="mt-2 text-sm text-title-muted">
        Choose a section to edit headings, text, and photos. Need to know which
        image is live today? See{' '}
        <Link to="/admin/site-images" className="underline">
          Where images appear
        </Link>
        .
      </p>
      <ul className="mt-8 space-y-2">
        {sections.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm"
          >
            <span>{s.section_key}</span>
            <span className="text-xs text-title-muted">
              {s.published ? 'Published' : 'Draft'}
            </span>
            <Link
              to={`/admin/pages/${slug}/sections/${s.section_key}`}
              className="text-xs underline"
            >
              Edit content
            </Link>
          </li>
        ))}
        {sections.length === 0 && (
          <li className="text-sm text-title-muted">
            No sections yet — add rows to <code>cms_page_sections</code> for this page.
          </li>
        )}
      </ul>
    </div>
  )
}
