import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { errorMessage } from '@/lib/http'
import { Button, Spinner } from './ui/Button'

/** Title row of every screen: where you are, what it is for, and its main action. */
export function PageHeader({ title, description, back, actions }: { title: string; description?: ReactNode; back?: { to: string; label: string }; actions?: ReactNode }) {
  return (
    <header className="mb-8">
      {back && (
        <Link to={back.to} className="mb-3 inline-flex items-center gap-1.5 font-display text-sm text-muted transition-colors hover:text-accent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-h2">{title}</h1>
          {description && <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  )
}

/** A titled block inside a form. */
export function Panel({ title, description, children, className }: { title?: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-card border border-line bg-bg p-5 sm:p-6 ${className ?? ''}`}>
      {title && <h2 className="font-display text-base font-semibold">{title}</h2>}
      {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
      <div className={title || description ? 'mt-5 grid gap-5' : 'grid gap-5'}>{children}</div>
    </section>
  )
}

export function Loading({ label = 'جارٍ التحميل…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-muted" role="status">
      <Spinner />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="rounded-card border border-line bg-surface px-6 py-12 text-center" role="alert">
      <p className="font-display">تعذّر تحميل البيانات</p>
      <p className="mt-1 text-sm text-muted">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          حاول مجدداً
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line px-6 py-14 text-center">
      <p className="font-display">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

const BADGE = {
  ok: 'bg-ok-soft text-ok',
  muted: 'bg-surface text-muted border border-line',
  accent: 'bg-tint text-text border border-accent/40',
  danger: 'bg-danger-soft text-danger',
} as const

export function Badge({ tone = 'muted', children }: { tone?: keyof typeof BADGE; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-pill px-2.5 py-0.5 font-display text-xs whitespace-nowrap ${BADGE[tone]}`}>{children}</span>
}

/** The save row under a form, kept in view while the form scrolls. */
export function FormActions({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="text-xs text-muted">{note}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
