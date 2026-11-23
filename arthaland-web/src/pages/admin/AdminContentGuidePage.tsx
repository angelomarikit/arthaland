import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'

export function AdminContentGuidePage() {
  return (
    <div className="max-w-3xl">
      <AdminBreadcrumbs items={[{ label: 'Content guide' }]} />
      <h1 className="text-2xl font-medium">How to edit the website</h1>
      <p className="mt-2 text-sm text-title-muted">
        Use this guide before asking for developer help. Start from{' '}
        <Link to="/admin/edit" className="underline">
          Edit website map
        </Link>{' '}
        for direct links to every section.
      </p>

      <div className="prose-sm mt-10 space-y-10 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="text-lg font-medium">1. Save and publish</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-title-muted">
            <li>Uploads go to storage immediately, but the <strong>live site</strong> updates only after you click Save on that admin screen.</li>
            <li>Properties must be <strong>Published</strong> or <strong>Coming soon</strong> on Overview.</li>
            <li>Gallery images need <strong>Publish / Public</strong> toggled on.</li>
            <li>Unit types must be <strong>Published</strong> (not Draft) for floor plans to show.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium">2. Homepage</h2>
          <p className="mt-2 text-title-muted">
            Hero → <Link to="/admin/homepage" className="underline">Homepage management</Link>. Home
            gallery &amp; lifestyle → their dedicated screens. Other homepage bands →{' '}
            <Link to="/admin/edit/site/home" className="underline">Edit home</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">3. Property pages</h2>
          <p className="mt-2 text-title-muted">
            Open <Link to="/admin/properties" className="underline">All Developments</Link> → choose a
            property → <strong>Edit property page</strong> for a full checklist in page order.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-title-muted">
            <li>
              <strong>Hero</strong> = Overview upload (not Media library alone).
            </li>
            <li>
              <strong>Certification logos</strong> = Certifications screen only — never in photo gallery.
            </li>
            <li>
              <strong>Photo gallery</strong> = Media library (facade, amenities, interiors).
            </li>
            <li>
              <strong>Floor plans</strong> = Units → Floor plan upload per unit type.
            </li>
            <li>
              <strong>Map</strong> = Location → Google Maps share link.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium">4. Drag to reorder</h2>
          <p className="mt-2 text-title-muted">
            Home gallery, lifestyle, property gallery images, gallery collections, and amenity lists
            support <strong>drag handles</strong> (⋮⋮) to change order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">5. Messenger &amp; inquiries</h2>
          <p className="mt-2 text-title-muted">
            Help widget → <strong>Message on Messenger</strong> (Gary Lee). Form submissions →{' '}
            <Link to="/admin/inquiries" className="underline">Inquiries</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium">6. When to contact support</h2>
          <p className="mt-2 text-title-muted">
            New page layouts, design changes, or bugs after following this guide. For content updates,
            the admin map should be enough.
          </p>
        </section>
      </div>
    </div>
  )
}