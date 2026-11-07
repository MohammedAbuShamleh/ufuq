'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Arrow } from '@/components/Button'
import type { Dictionary, LeadType } from '@/i18n/dictionaries/ar'
import { useLocale } from '@/i18n/LocaleProvider'

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; note?: string }
type Errors = Partial<Record<'name' | 'contact' | 'project_type', string>>

const FIELDS = ['name', 'contact', 'project_type'] as const

type Props = {
  endpoint: string
  copy: Dictionary['contactForm']
  /** What the API stores for each kind: its Arabic name, in every language. */
  submitAs: Record<LeadType, string>
}

/**
 * Sends the visitor's details straight to the API (POST /leads), with the
 * page's language. The API checks them; its messages show under each field.
 */
export function ContactForm({ endpoint, copy, submitAs }: Props) {
  const { locale } = useLocale()
  const types = Object.keys(copy.types) as LeadType[]
  const isType = (value: string | null | undefined): value is LeadType => types.includes(value as LeadType)
  const [type, setType] = useState<LeadType | ''>('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [errors, setErrors] = useState<Errors>({})
  const formRef = useRef<HTMLFormElement>(null)

  // After a failed send the first field in error takes focus, so its message
  // is read out and, on a phone, scrolled into view.
  useEffect(() => {
    const first = FIELDS.find((f) => errors[f])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }, [errors])

  // «أريد منصة مشابهة» on a project card picks the project type here: from a
  // click on this page, or from ?type= when it comes from a project page.
  useEffect(() => {
    const preset = new URLSearchParams(location.search).get('type')
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration
    if (isType(preset)) setType(preset)
    const pick = (e: MouseEvent) => {
      const picked = (e.target as Element).closest<HTMLElement>('a[data-type]')?.dataset.type
      if (isType(picked)) setType(picked)
    }
    document.addEventListener('click', pick)
    return () => document.removeEventListener('click', pick)
    // The kinds are the same for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const kind = form.get('project_type')
    setStatus({ kind: 'sending' })
    setErrors({})
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          contact: form.get('contact'),
          project_type: isType(kind as string) ? submitAs[kind as LeadType] : null,
          website: form.get('website'),
          source_page: location.pathname,
          locale,
        }),
      })
      if (res.ok) {
        formEl.reset()
        setType('')
        return setStatus({ kind: 'sent', note: copy.sent })
      }
      if (res.status === 422) {
        const body = (await res.json()) as { errors?: Record<string, string[]> }
        const found = Object.fromEntries(Object.entries(body.errors ?? {}).map(([k, v]) => [k, v[0]])) as Errors
        setErrors(found)
        return setStatus({ kind: 'error', note: copy.invalid })
      }
      if (res.status === 429) {
        return setStatus({ kind: 'error', note: copy.tooMany })
      }
      throw new Error(String(res.status))
    } catch {
      setStatus({ kind: 'error', note: copy.failed })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <form ref={formRef} className="ctx-form" onSubmit={submit} noValidate>
      <span className="ctx-form-title">{copy.title}</span>
      <Field name="name" label={copy.name} autoComplete="name" error={errors.name} />
      <Field name="contact" label={copy.contact} autoComplete="email" error={errors.contact} />
      <label className="full">
        <span>{copy.type}</span>
        <select
          name="project_type"
          value={type}
          onChange={(e) => setType(isType(e.target.value) ? e.target.value : '')}
          aria-invalid={!!errors.project_type || undefined}
          aria-describedby={errors.project_type ? 'project_type-error' : undefined}
        >
          <option value="">{copy.type}</option>
          {types.map((key) => (
            <option key={key} value={key}>
              {copy.types[key]}
            </option>
          ))}
        </select>
        {errors.project_type && (
          <em className="ctx-err" id="project_type-error">
            {errors.project_type}
          </em>
        )}
      </label>
      {/* Honeypot: hidden from people, so only bots fill it in. */}
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn-primary full" type="submit" disabled={sending} aria-busy={sending}>
        {sending ? copy.sending : copy.send} <Arrow />
      </button>
      <p className={`cta-note full${status.kind === 'error' ? ' err' : ''}${status.kind === 'sent' ? ' ok' : ''}`} role="status">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        <span>{status.note ?? copy.privacy}</span>
      </p>
    </form>
  )
}

function Field({ name, label, autoComplete, error }: { name: string; label: string; autoComplete: string; error?: string }) {
  const errorId = `${name}-error`
  return (
    <label>
      <span>{label}</span>
      <input name={name} autoComplete={autoComplete} required aria-invalid={!!error || undefined} aria-describedby={error ? errorId : undefined} />
      {error && (
        <em className="ctx-err" id={errorId}>
          {error}
        </em>
      )}
    </label>
  )
}
