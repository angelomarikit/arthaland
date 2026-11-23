import { AdminSortableList } from './AdminSortableList'

type AdminSortableLinesProps = {
  value: string
  onChange: (next: string) => void
  label?: string
}

export function AdminSortableLines({ value, onChange, label }: AdminSortableLinesProps) {
  const lines = value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const items = lines.map((line, index) => ({ id: `line-${index}-${line.slice(0, 12)}`, line }))

  return (
    <div>
      {label ? <p className="text-sm font-medium">{label}</p> : null}
      <p className="mt-1 text-xs text-title-muted">Drag ⋮⋮ to reorder. Type below to add lines.</p>
      {items.length > 0 ? (
        <AdminSortableList
          className="mt-3 space-y-2"
          itemClassName="flex items-center gap-2 rounded-xl border border-border bg-surface-soft px-3 py-2 text-sm"
          items={items}
          onReorder={(next) => onChange(next.map((i) => i.line).join('\n'))}
          renderItem={(item, handle) => (
            <>
              {handle}
              <span className="min-w-0 flex-1">{item.line}</span>
            </>
          )}
        />
      ) : (
        <p className="mt-2 text-xs text-title-muted">No lines yet.</p>
      )}
    </div>
  )
}