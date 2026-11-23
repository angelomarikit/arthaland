import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminSectionMapCard } from '../../components/admin/AdminSectionMapCard'
import { PropertyPublicVisibilityPanel } from '../../components/admin/PropertyPublicVisibilityPanel'
import { propertyPageEditSections } from '../../config/adminContentMap'
import { fetchAdminDevelopment } from '../../lib/cms/developmentsApi'

export function AdminPropertyEditHubPage() {
  const { slug = '' } = useParams()
  const [name, setName] = useState(slug)
  const sections = propertyPageEditSections(slug)

  useEffect(() => {
    fetchAdminDevelopment(slug).then((d) => {
      if (d?.name) setName(d.name)
    })
  }, [slug])

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Edit website', href: '/admin/edit' },
          { label: 'Properties', href: '/admin/properties' },
          { label: name },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">{name}</h1>
          <p className="text-sm text-title-muted">/properties/{slug}</p>
        </div>
        <Link
          to={`/properties/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-border px-4 py-2 text-sm"
        >
          Open live property page
        </Link>
      </div>

      <PropertyPublicVisibilityPanel slug={slug} className="mt-6" />

      <p className="mt-6 max-w-2xl text-sm text-title-muted">
        Edit each block below. Numbers match the order on the public property page.
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