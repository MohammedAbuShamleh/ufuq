import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastApi, type ToastTone } from './toast'

type Toast = { id: number; tone: ToastTone; message: string }

const DURATION: Record<ToastTone, number> = { ok: 3500, error: 7000 }

/**
 * Short notices at the bottom of the screen. The region exists before any
 * message, so screen readers announce each one as it is added.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const next = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])

  const show = useCallback(
    (tone: ToastTone, message: string) => {
      const id = next.current++
      // One copy of a message at a time: repeated clicks don't stack the same line.
      setToasts((all) => [...all.filter((t) => t.message !== message), { id, tone, message }].slice(-3))
      window.setTimeout(() => dismiss(id), DURATION[tone])
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(() => ({ ok: (m) => show('ok', m), error: (m) => show('error', m) }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-5 z-50 flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-pill py-2.5 ps-4 pe-2 font-display text-sm shadow-card animate-[toast-in_.35s_var(--ease-brand)] ${
              t.tone === 'ok' ? 'bg-text text-bg' : 'bg-danger text-bg'
            }`}
          >
            {t.tone === 'ok' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 7v6M12 17h.01" />
              </svg>
            )}
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="grid size-7 cursor-pointer place-items-center rounded-full opacity-70 hover:opacity-100" aria-label="إغلاق التنبيه">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
