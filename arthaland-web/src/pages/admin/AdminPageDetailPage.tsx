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
      <h1 className="text-2xl font-medium capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-title-muted">
        Each block on this page is listed below. Select <strong className="font-medium text-ink">Edit content</strong>{' '}
        to change that block’s headline, supporting text, main paragraph, and image.
        Turn on <strong className="font-medium text-ink">Show on live website</strong>{' '}
        when you are ready for visitors to see it.
      </p>
      <p className="mt-2 text-sm text-title-muted">
        Unsure which photo is on the site today? See{' '}
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
            <span className="capitalize">{s.section_key.replace(/-/g, ' ')}</span>
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
          <li className="rounded-xl border border-dashed border-border bg-surface-soft px-4 py-6 text-sm text-title-muted">
            No editable sections are set up for this page yet. Ask your website
            administrator to add the section list for “{slug}” — then you can edit
            content here.
          </li>
        )}
      </ul>
    </div>
  )
}
