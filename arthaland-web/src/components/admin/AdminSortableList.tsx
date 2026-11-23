import { useState, type DragEvent, type ReactNode } from 'react'
import { GripVertical } from 'lucide-react'

type AdminSortableListProps<T extends { id: string }> = {
  items: T[]
  onReorder: (next: T[]) => void | Promise<void>
  renderItem: (item: T, handle: ReactNode) => ReactNode
  className?: string
  itemClassName?: string
}

export function AdminSortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className = 'space-y-3',
  itemClassName = 'rounded-2xl border border-border bg-surface',
}: AdminSortableListProps<T>) {
  const [dragId, setDragId] = useState<string | null>(null)

  function reorder(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    const from = items.findIndex((i) => i.id === draggedId)
    const to = items.findIndex((i) => i.id === targetId)
    if (from < 0 || to < 0) return
    const next = [...items]
    const [removed] = next.splice(from, 1)
    next.splice(to, 0, removed!)
    void onReorder(next)
  }

  const handleProps = (id: string) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      setDragId(id)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
    },
    onDragEnd: () => setDragId(null),
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      const dragged = dragId ?? e.dataTransfer.getData('text/plain')
      if (dragged) reorder(dragged, id)
      setDragId(null)
    },
  })

  const handle = (
    <span
      className="flex cursor-grab items-center text-title-muted active:cursor-grabbing"
      title="Drag to reorder"
      aria-hidden
    >
      <GripVertical className="size-4" />
    </span>
  )

  return (
    <ul className={className}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`${itemClassName} ${dragId === item.id ? 'opacity-60' : ''}`}
          {...handleProps(item.id)}
        >
          {renderItem(item, handle)}
        </li>
      ))}
    </ul>
  )
}