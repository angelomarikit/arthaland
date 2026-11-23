import { Link, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminSectionMapCard } from '../../components/admin/AdminSectionMapCard'
import {
  homePageEditSections,
  marketingPageEditSections,
} from '../../config/adminContentMap'

export function AdminPageEditHubPage() {
  const { slug = 'home' } = useParams()
  const isHome = slug === 'home'
  const pageSlug = slug

  const sections = isHome ? homePageEditSections() : marketingPageEditSections(pageSlug)
  const title = isHome ? 'Homepage' : pageSlug.replace(/-/g, ' ')
  const preview = isHome ? '/' : `/${pageSlug}`

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Edit website', href: '/admin/edit' },
          { label: title },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageEditHubHeader title={title} preview={preview} />
        <Link
          to={preview}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-border px-4 py-2 text-sm"
        >
          Open live page
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-title-muted">
        Sections appear in the same order as on the public site. Layout and styling are fixed; you
        control text, images, and publish settings.
      </p>

      <ol className="mt-10 space-y-4">
        {sections.map((section, index) => (
          <li key={section.id} className="relative pl-10">
            <span className="absolute left-0 top-5 flex size-7 items-center justify-center rounded-full border border-border bg-surface-soft text-xs font-medium">
              {index + 1}
            </span>
            <AdminSectionMapCard section={section} />
          </li>
        ))}
      </ol>
    </div>
  )
}

function PageEditHubHeader({ title, preview }: { title: string; preview: string }) {
  return (
    <div>
      <h1 className="text-2xl font-medium capitalize">{title}</h1>
      <p className="text-sm text-title-muted">{preview}</p>
    </div>
  )
}