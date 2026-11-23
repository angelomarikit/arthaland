import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { AdminSortableLines } from '../../components/admin/AdminSortableLines'
import { fetchAdminDevelopment, updateDevelopment } from '../../lib/cms/developmentsApi'

export function AdminPropertyAmenitiesPage() {
  const { slug = '' } = useParams()
  const [name, setName] = useState('')
  const [devId, setDevId] = useState('')
  const [amenitiesText, setAmenitiesText] = useState('')
  const [sustainText, setSustainText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminDevelopment(slug).then((dev) => {
      if (!dev) return
      setName(dev.name)
      setDevId(dev.id)
      setAmenitiesText((dev.amenities ?? []).join('\n'))
      setSustainText((dev.sustainability ?? []).join('\n'))
    })
  }, [slug])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    await updateDevelopment(devId, {
      amenities: amenitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
      sustainability: sustainText.split('\n').map((s) => s.trim()).filter(Boolean),
    })
    setSaved(true)
  }

  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: 'Properties', href: '/admin/properties' },
          { label: name || slug, href: `/admin/properties/${slug}` },
          { label: 'Amenities' },
        ]}
      />
      <h1 className="text-2xl font-medium">Amenities & sustainability</h1>
      <form onSubmit={onSave} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <AdminSortableLines
          label="Amenities (one per line)"
          value={amenitiesText}
          onChange={setAmenitiesText}
        />
        <textarea
          rows={4}
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Type a line and press Enter to add…"
        />
        <AdminSortableLines
          label="Sustainability highlights (one per line)"
          value={sustainText}
          onChange={setSustainText}
        />
        <textarea
          rows={3}
          value={sustainText}
          onChange={(e) => setSustainText(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Type a line and press Enter to add…"
        />
        {saved && <p className="text-sm text-emerald-800">Saved.</p>}
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Save
        </button>
      </form>
    </div>
  )
}
