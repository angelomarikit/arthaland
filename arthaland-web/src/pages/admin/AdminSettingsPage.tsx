import { useEffect, useState, type FormEvent } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { getSupabaseClient } from '../../lib/supabase/client'

const KEYS = ['header', 'footer', 'social', 'seo'] as const

export function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    supabase.from('cms_site_settings').select('*').then(({ data }) => {
      const map: Record<string, string> = {}
      for (const row of data ?? []) {
        map[row.key] = JSON.stringify(row.value, null, 2)
      }
      setValues(map)
    })
  }, [])

  async function saveKey(key: string) {
    const supabase = getSupabaseClient()
    if (!supabase) return
    const parsed = JSON.parse(values[key] ?? '{}') as Record<string, unknown>
    const { error } = await supabase.from('cms_site_settings').upsert({
      key,
      value: parsed,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    setSaved(true)
  }

  return (
    <div className="max-w-2xl">
      <AdminBreadcrumbs items={[{ label: 'Settings' }]} />
      <h1 className="text-2xl font-medium">Site settings</h1>
      <p className="mt-2 text-sm text-title-muted">
        Non-secret global content only — never store API keys here.
      </p>
      {KEYS.map((key) => (
        <form
          key={key}
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            void saveKey(key)
          }}
          className="mt-6 rounded-2xl border border-border bg-surface p-6"
        >
          <h2 className="text-sm font-medium capitalize">{key}</h2>
          <textarea
            rows={8}
            value={values[key] ?? '{\n  \n}'}
            onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            className="mt-3 w-full rounded-xl border border-border px-3 py-2 font-mono text-xs"
          />
          <button type="submit" className="mt-3 rounded-xl border border-border px-4 py-2 text-sm">
            Save {key}
          </button>
        </form>
      ))}
      {saved && <p className="mt-4 text-sm text-emerald-800">Saved.</p>}
    </div>
  )
}
