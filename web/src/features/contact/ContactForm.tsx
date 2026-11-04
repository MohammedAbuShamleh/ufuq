'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Arrow } from '@/components/Button'

const TYPES = ['موقع إبداعي', 'نظام ERP', 'نظام مالي', 'منصة إلكترونية', 'تطبيق جوال', 'أمر آخر']

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; note?: string }
type Errors = Partial<Record<'name' | 'contact' | 'project_type', string>>

const PRIVACY_NOTE = 'بياناتك لا تُشارك مع أحد.'

/**
 * Sends the visitor's details straight to the API (POST /leads). The API
 * checks them and answers in Arabic; its messages show under each field.
 */
export function ContactForm({ endpoint }: { endpoint: string }) {
  const [type, setType] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [errors, setErrors] = useState<Errors>({})

  // «أريد منصة مشابهة» on a project card picks the project type here.
  useEffect(() => {
    const pick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLElement>('a[data-type]')
      if (link?.dataset.type && TYPES.includes(link.dataset.type)) setType(link.dataset.type)
    }
    document.addEventListener('click', pick)
    return () => document.removeEventListener('click', pick)
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    setStatus({ kind: 'sending' })
    setErrors({})
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          contact: form.get('contact'),
          project_type: form.get('project_type') || null,
          website: form.get('website'),
          source_page: location.pathname,
        }),
      })
      if (res.ok) {
        formEl.reset()
        setType('')
        return setStatus({ kind: 'sent', note: 'وصلنا طلبك، وسنتواصل معك قريباً.' })
      }
      if (res.status === 422) {
        const body = (await res.json()) as { errors?: Record<string, string[]> }
        const found = Object.fromEntries(Object.entries(body.errors ?? {}).map(([k, v]) => [k, v[0]])) as Errors
        setErrors(found)
        return setStatus({ kind: 'error', note: 'راجع الحقول المظلّلة ثم أرسل مرة أخرى.' })
      }
      if (res.status === 429) {
        return setStatus({ kind: 'error', note: 'أرسلت عدة طلبات في دقيقة واحدة. انتظر قليلاً ثم أعد المحاولة.' })
      }
      throw new Error(String(res.status))
    } catch {
      setStatus({ kind: 'error', note: 'تعذّر الإرسال الآن. أعد المحاولة بعد قليل، أو راسلنا على واتساب.' })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <form className="ctx-form" onSubmit={submit} noValidate>
      <span className="ctx-form-title">أو اترك بياناتك ونتصل بك</span>
      <Field name="name" label="الاسم الكامل" autoComplete="name" error={errors.name} />
      <Field name="contact" label="البريد أو رقم الجوال" autoComplete="email" error={errors.contact} />
      <label className="full">
        <span>نوع المشروع</span>
        <select name="project_type" value={type} onChange={(e) => setType(e.target.value)} aria-invalid={!!errors.project_type || undefined}>
          <option value="">نوع المشروع</option>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {errors.project_type && <em className="ctx-err">{errors.project_type}</em>}
      </label>
      {/* Honeypot: hidden from people, so only bots fill it in. */}
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn-primary full" type="submit" disabled={sending} aria-busy={sending}>
        {sending ? 'جارٍ الإرسال…' : 'ابدأ المحادثة'} <Arrow />
      </button>
      <p className={`cta-note full${status.kind === 'error' ? ' err' : ''}${status.kind === 'sent' ? ' ok' : ''}`} role="status">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
        <span>{status.note ?? PRIVACY_NOTE}</span>
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
