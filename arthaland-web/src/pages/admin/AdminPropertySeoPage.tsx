import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { fetchAdminDevelopment, updateDevelopment } from '../../lib/cms/developmentsApi'
import type { DbDevelopment } from '../../lib/supabase/database.types'

export function AdminPropertySeoPage() {
  const { slug = '' } = useParams()
  const [dev, setDev] = useState<DbDevelopment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminDevelopment(slug).then(setDev).catch((e: Error) => setError(e.message))
  }, [slug])

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dev) return
    const fd = new FormData(e.currentTarget)
  const raw = String(fd.get('seo_json') ?? '{}')
    try {
      const seo = JSON.parse(raw) as Record<string, unknown>
      await updateDevelopment(dev.id, { seo })
      setSaved(true)
    } catch {
      setError('Invalid JSON')
    }
  }

  if (!dev && !error) return <p className="text-sm text-title-muted">Loading…</p>
  if (!dev) return <p className="text-sm text-red-700">{error}</p>

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: dev.name, href: `/admin/properties/${slug}` },
          { label: 'SEO' },
        ]}
      />
      <h1 className="text-2xl font-medium">SEO metadata</h1>
      <form onSubmit={onSave} className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          SEO JSON
          <textarea
            name="seo_json"
            rows={12}
            defaultValue={JSON.stringify(dev.seo ?? {}, null, 2)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {saved && <p className="text-sm text-emerald-800">Saved.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save
        </button>
      </form>
    </div>
  )
}
