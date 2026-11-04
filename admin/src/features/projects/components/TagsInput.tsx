import { useState, type KeyboardEvent } from 'react'
import { Field, inputClass } from '@/components/ui/Field'

type Props = { label: string; hint?: string; error?: string; value: string[]; max: number; onChange: (v: string[]) => void }

/** Short Latin labels (the tech stack): type one, press Enter or comma to add it. */
export function TagsInput({ label, hint, error, value, max, onChange }: Props) {
  const [text, setText] = useState('')

  const commit = () => {
    const tag = text.trim().replace(/,$/, '')
    if (tag && !value.includes(tag) && value.length < max) onChange([...value, tag])
    setText('')
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1))
  }

  return (
    <Field label={label} hint={hint} error={error} count={{ value: value.length, max }}>
      {(a11y) => (
        <div className={`${inputClass} flex flex-wrap items-center gap-1.5 py-2 focus-within:border-accent`} dir="ltr">
          {value.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-pill bg-surface py-0.5 ps-2.5 pe-1 font-mono text-xs">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="grid size-5 cursor-pointer place-items-center rounded-full text-muted hover:text-danger" aria-label={`إزالة ${tag}`}>
                ×
              </button>
            </span>
          ))}
          <input {...a11y} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} onBlur={commit} disabled={value.length >= max} className="min-w-28 flex-1 bg-transparent py-0.5 outline-none" placeholder={value.length ? '' : 'Laravel'} />
        </div>
      )}
    </Field>
  )
}
