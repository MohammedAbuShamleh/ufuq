import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import { formatNumber } from '@/lib/format'

type Item = { id: number }

type Props<T extends Item> = {
  items: T[]
  /** The new order, saved by the caller as soon as the item is dropped. */
  onReorder: (ids: number[]) => void
  /** The item's name, read out while it is moved by keyboard or screen reader. */
  name: (item: T) => string
  layout?: 'list' | 'grid'
  className?: string
  children: (item: T, handle: ReactNode) => ReactNode
}

/** A list the team orders by dragging the handle, or with Space + arrow keys. */
export function SortableList<T extends Item>({ items, onReorder, name, layout = 'list', className, children }: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const nameOf = (id: UniqueIdentifier) => {
    const item = items.find((i) => i.id === id)
    return item ? name(item) : ''
  }
  const position = (id: UniqueIdentifier | undefined) => items.findIndex((i) => i.id === id) + 1

  const announcements: Announcements = {
    onDragStart: ({ active }) => `التُقط «${nameOf(active.id)}». استخدم الأسهم للتحريك ثم المسافة للإفلات.`,
    onDragOver: ({ active, over }) => (over ? `«${nameOf(active.id)}» الآن في الموضع ${formatNumber(position(over.id))} من ${formatNumber(items.length)}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `وُضع «${nameOf(active.id)}» في الموضع ${formatNumber(position(over.id))}.` : undefined),
    onDragCancel: ({ active }) => `أُلغي تحريك «${nameOf(active.id)}».`,
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex((i) => i.id === active.id)
    const to = items.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(items, from, to).map((i) => i.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{ announcements, screenReaderInstructions: { draggable: 'للترتيب: اضغط المسافة لالتقاط العنصر، ثم الأسهم لتحريكه، ثم المسافة لإفلاته أو Esc للإلغاء.' } }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={layout === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}>
        <ul className={className}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id} label={name(item)}>
              {(handle) => children(item, handle)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({ id, label, children }: { id: number; label: string; children: (handle: ReactNode) => ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, attributes: { roleDescription: 'عنصر قابل للترتيب' } })

  const handle = (
    <button
      ref={setActivatorNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      aria-label={`اسحب لترتيب «${label}»`}
      className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-field text-muted transition-colors hover:bg-surface hover:text-text active:cursor-grabbing"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="15" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" />
        <circle cx="15" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
      </svg>
    </button>
  )

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`relative min-w-0 ${isDragging ? 'z-10 opacity-90 [&>*]:shadow-card' : ''}`}
    >
      {children(handle)}
    </li>
  )
}
