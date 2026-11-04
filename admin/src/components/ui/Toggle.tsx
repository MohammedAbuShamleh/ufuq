import { useId, type ReactNode } from 'react'

/** A yes/no setting as a switch, with a line that says what «on» means. */
export function Toggle({ label, description, checked, onChange }: { label: string; description?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()

  return (
    <div className="flex items-start justify-between gap-4 rounded-field border border-line px-4 py-3">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-display text-sm font-medium">{label}</span>
        {description && (
          <span id={`${id}-d`} className="mt-0.5 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        )}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-d` : undefined}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-pill transition-colors duration-200 ease-brand ${checked ? 'bg-accent' : 'bg-line'}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 size-5 rounded-full bg-bg transition-[inset-inline-start] duration-200 ease-brand ${checked ? 'start-5.5' : 'start-0.5'}`}
        />
      </button>
    </div>
  )
}
