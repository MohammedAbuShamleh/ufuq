import { createContext, useContext } from 'react'

export type ToastTone = 'ok' | 'error'

export type ToastApi = {
  ok: (message: string) => void
  error: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

/** The line every save shows: the site picks the change up on its own. */
// The API refreshes the site from a queue that cron drains every minute.
export const SAVED = 'حُفظ، ويظهر في الموقع خلال دقيقة.'
export const DELETED = 'حُذف، ويختفي من الموقع خلال دقيقة.'

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
