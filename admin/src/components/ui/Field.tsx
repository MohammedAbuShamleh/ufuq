import { useId, type ReactNode } from 'react'
import { formatNumber } from '@/lib/format'

export type FieldA11y = {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
  'aria-required'?: true
}

type FieldProps = {
  label: string
  hint?: ReactNode
  error?: string
  required?: boolean
  /** Shows «12 / 120» under the input. */
  count?: { value: number; max: number }
  className?: string
  children: (a11y: FieldA11y) => ReactNode
}

export const inputClass =
  'block w-full rounded-field border border-line bg-bg px-3.5 py-2.5 text-text transition-colors duration-200 placeholder:text-muted/70 hover:border-muted/60 focus:border-accent aria-[invalid=true]:border-danger disabled:opacity-60'

/** A label, its input and the hint or server error under it, wired for screen readers. */
export function Field({ label, hint, error, required, count, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined
  const over = count && count.value > count.max

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-display text-sm font-medium text-text">
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {(hint || count || error) && (
        <div className="mt-1.5 flex items-start justify-between gap-3 text-xs leading-relaxed">
          <div>
            {error && (
              <p id={errorId} className="text-danger">
                {error}
              </p>
            )}
            {hint && (
              <p id={hintId} className="text-muted">
                {hint}
              </p>
            )}
          </div>
          {count && (
            <span className={`shrink-0 tabular-nums ${over ? 'text-danger' : 'text-muted'}`} dir="ltr">
              {formatNumber(count.value)} / {formatNumber(count.max)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

type Common = { label: string; hint?: ReactNode; error?: string; required?: boolean; className?: string; max?: number; placeholder?: string; dir?: 'rtl' | 'ltr' }

export function TextField({ value, onChange, type = 'text', autoComplete, ...p }: Common & { value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) {
  return (
    <Field label={p.label} hint={p.hint} error={p.error} required={p.required} className={p.className} count={p.max ? { value: value.length, max: p.max } : undefined}>
      {(a11y) => (
        <input {...a11y} type={type} dir={p.dir} value={value} placeholder={p.placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
    </Field>
  )
}

export function TextAreaField({ value, onChange, rows = 4, ...p }: Common & { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <Field label={p.label} hint={p.hint} error={p.error} required={p.required} className={p.className} count={p.max ? { value: value.length, max: p.max } : undefined}>
      {(a11y) => (
        <textarea {...a11y} rows={rows} dir={p.dir} value={value} placeholder={p.placeholder} onChange={(e) => onChange(e.target.value)} className={`${inputClass} resize-y leading-loose`} />
      )}
    </Field>
  )
}

export function SelectField<V extends string>({
  value,
  onChange,
  options,
  ...p
}: Common & { value: V | ''; onChange: (v: V) => void; options: readonly { value: V; label: string }[]; emptyLabel?: string }) {
  return (
    <Field label={p.label} hint={p.hint} error={p.error} required={p.required} className={p.className}>
      {(a11y) => (
        <select {...a11y} value={value} onChange={(e) => onChange(e.target.value as V)} className={`${inputClass} cursor-pointer`}>
          {value === '' && !options.some((o) => o.value === '') && <option value="">{p.emptyLabel ?? 'اختر…'}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}
