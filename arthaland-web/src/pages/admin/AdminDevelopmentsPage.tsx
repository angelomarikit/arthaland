import { Link } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import { getAllDevelopmentRecords } from '../../data/repositories/developmentRepository'

export function AdminDevelopmentsPage() {
  const rows = getAllDevelopmentRecords()

  return (
    <Container className="section-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-title-muted">Preview mode</p>
          <h1 className="text-heading-3 mt-2">All developments</h1>
          <p className="mt-2 max-w-xl text-sm text-title-muted">
            CMS preview — changes are not saved until Supabase integration is
            connected. Ten default records are seeded locally.
          </p>
        </div>
        <Link to="/admin" className="text-sm underline">
          ← Dashboard
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-soft text-nav text-title-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Publication</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="bg-surface">
                <td className="px-4 py-3">{row.displayOrder}</td>
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3 capitalize">{row.publicationStatus.replace('_', ' ')}</td>
                <td className="px-4 py-3 capitalize">{row.category}</td>
                <td className="px-4 py-3">{row.featured ? 'Yes' : '—'}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/admin/developments/${row.slug}`}
                    className="underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}
