import { Link, useParams } from 'react-router-dom'
import { Container } from '../../components/ui/Container'
import {
  getDevelopmentMedia,
  getDevelopmentRecordBySlug,
  getUnitTypesByDevelopment,
} from '../../data/repositories/developmentRepository'

export function AdminDevelopmentEditPage() {
  const { slug } = useParams()
  const record = slug ? getDevelopmentRecordBySlug(slug) : undefined

  if (!record) {
    return (
      <Container className="section-x py-16">
        <p>Development not found in seed data.</p>
        <Link to="/admin/developments" className="mt-4 inline-block underline">
          Back to list
        </Link>
      </Container>
    )
  }

  const media = getDevelopmentMedia(record.id)
  const units = getUnitTypesByDevelopment(record.id)

  return (
    <Container className="section-x py-10">
      <Link to="/admin/developments" className="text-sm underline">
        ← All developments
      </Link>
      <p className="text-eyebrow mt-6 text-title-muted">Preview editor</p>
      <h1 className="text-heading-3 mt-2">{record.name}</h1>
      <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 px-4 py-3">
        Preview mode — form fields are read-only placeholders. Supabase persistence
        not connected.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section className="border border-border bg-surface p-6">
          <h2 className="font-medium">Basic information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-title-muted">Slug</dt>
              <dd>{record.slug}</dd>
            </div>
            <div>
              <dt className="text-title-muted">Location</dt>
              <dd>{record.location}</dd>
            </div>
            <div>
              <dt className="text-title-muted">Publication</dt>
              <dd className="capitalize">{record.publicationStatus}</dd>
            </div>
            <div>
              <dt className="text-title-muted">Availability</dt>
              <dd>{record.availabilityStatus}</dd>
            </div>
          </dl>
        </section>

        <section className="border border-border bg-surface p-6">
          <h2 className="font-medium">Gallery manager (preview)</h2>
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {media.map((m) => (
              <li key={m.id} className="aspect-square border border-border">
                <img src={m.publicUrl} alt={m.altText} className="size-full object-cover" />
              </li>
            ))}
            {media.length === 0 && (
              <li className="col-span-3 text-sm text-title-muted">No media rows yet.</li>
            )}
          </ul>
        </section>

        <section className="border border-border bg-surface p-6 lg:col-span-2">
          <h2 className="font-medium">Unit types (preview)</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {units.map((u) => (
              <li key={u.id} className="flex justify-between border-b border-border py-2">
                <span>{u.name}</span>
                <span className="text-title-muted">{u.publicationStatus}</span>
              </li>
            ))}
            {units.length === 0 && (
              <li className="text-title-muted">No unit types seeded.</li>
            )}
          </ul>
        </section>
      </div>
    </Container>
  )
}
