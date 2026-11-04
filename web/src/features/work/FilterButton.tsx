import { arNum } from '@/lib/format'

/** A filter pill with its count; a filter with nothing behind it cannot be picked. */
export function FilterButton({ on, onClick, label, count }: { on: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" className={on ? 'on' : undefined} aria-pressed={on} disabled={count === 0 && !on} onClick={onClick}>
      {label} <i>{arNum(count)}</i>
    </button>
  )
}
