import { useEffect, useState, type FormEvent } from 'react'
import { AdminBreadcrumbs } from '../../components/admin/AdminBreadcrumbs'
import { getSupabaseClient } from '../../lib/supabase/client'
import type { DbTeamMember } from '../../lib/supabase/database.types'

export function AdminTeamPage() {
  const [members, setMembers] = useState<DbTeamMember[]>([])

  async function load() {
    const supabase = getSupabaseClient()
    if (!supabase) return
    const { data } = await supabase.from('cms_team_members').select('*').order('display_order')
    setMembers((data ?? []) as DbTeamMember[])
  }

  useEffect(() => {
    void load()
  }, [])

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const supabase = getSupabaseClient()
    if (!supabase) return
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('cms_team_members').insert({
      name: String(fd.get('name')),
      role: String(fd.get('role')),
      bio: String(fd.get('bio') ?? ''),
      display_order: members.length,
      published: false,
    })
    if (error) throw error
    await load()
    e.currentTarget.reset()
  }

  return (
    <div>
      <AdminBreadcrumbs items={[{ label: 'Team' }]} />
      <h1 className="text-2xl font-medium">Team members</h1>
      <form onSubmit={onAdd} className="mt-6 max-w-md space-y-3 rounded-2xl border border-border bg-surface p-6">
        <input name="name" required placeholder="Name" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <input name="role" required placeholder="Role" className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <textarea name="bio" placeholder="Bio" rows={4} className="w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm text-surface">
          Add member
        </button>
      </form>
      <ul className="mt-8 space-y-3">
        {members.map((m) => (
          <li key={m.id} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            <p className="font-medium">{m.name}</p>
            <p className="text-title-muted">{m.role}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
