import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { createDevelopment } from '../../lib/cms/propertyDetailApi'

export function AdminPropertyCreatePage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const created = await createDevelopment({
        slug: String(fd.get('slug') ?? ''),
        name: String(fd.get('name') ?? ''),
        location: String(fd.get('location') ?? ''),
        region: String(fd.get('region') ?? ''),
      })
      navigate(`/admin/properties/${created.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: 'New property' },
        ]}
      />
      <h1 className="text-2xl font-medium">Create property</h1>
      <form
        onSubmit={onSubmit}
        className="mt-8 max-w-lg space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <label className="block text-sm">
          Slug
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            placeholder="liv"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Name
          <input name="name" required className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
        </label>
        <label className="block text-sm">
          Location label
          <input name="location" className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
        </label>
        <label className="block text-sm">
          Region
          <input
            name="region"
            defaultValue="Metro Cebu"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink px-4 py-2 text-sm text-surface disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create draft'}
        </button>
      </form>
    </div>
  )
}
