import { Link } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { siteConfig } from '../../config/site'

export function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs items={[{ label: 'Settings' }]} />
      <h1 className="text-2xl font-medium">Site settings</h1>
      <p className="mt-2 text-sm text-title-muted">
        Simple reference for what appears on the public site today. To change
        phone numbers or footer text, contact your developer or use future CMS
        fields — we avoid raw configuration files here on purpose.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Sales contact (public site)</h2>
          <p className="mt-2 text-sm text-ink">{siteConfig.contact.salesEmail}</p>
          <ul className="mt-2 text-sm text-title-muted">
            {siteConfig.contact.salesPhones.map((p) => (
              <li key={p.tel}>{p.display}</li>
            ))}
          </ul>
          <ul className="mt-4 text-sm text-title-muted">
            {siteConfig.footer.office.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Website inquiries</h2>
          <p className="mt-2 text-sm text-title-muted">
            Contact and Help widget submissions are saved in Supabase and listed under{' '}
            <Link to="/admin/inquiries" className="font-medium text-ink underline">
              Inquiries
            </Link>
            . No automatic email is sent — check the admin inbox regularly.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Social</h2>
          <a
            href={siteConfig.social.facebook}
            className="mt-2 inline-block text-sm underline"
            target="_blank"
            rel="noreferrer"
          >
            Facebook page
          </a>
        </div>

        <Link
          to="/admin/site-images"
          className="block rounded-2xl border border-ink/20 bg-surface-soft p-5 text-sm hover:border-ink/40"
        >
          <span className="font-medium">Where images appear on the website →</span>
          <span className="mt-1 block text-title-muted">
            See every photo, what page it is on, and whether it is a placeholder.
          </span>
        </Link>
      </div>
    </div>
  )
}
