import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '../ui/Button'
import { ConfirmContext, type ConfirmOptions } from './confirm'

/**
 * One native <dialog> for every confirmation: it traps focus, closes on Esc
 * and returns focus to the button that opened it.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const resolver = useRef<((ok: boolean) => void) | null>(null)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback((next: ConfirmOptions) => {
    // A fresh object each time, so asking twice in a row opens the dialog twice.
    setOptions({ ...next })
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  // Open once React has rendered the new text.
  useEffect(() => {
    if (options && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [options])

  const settle = (ok: boolean) => {
    resolver.current?.(ok)
    resolver.current = null
    dialog.current?.close()
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="confirm-title"
        aria-describedby={options?.body ? 'confirm-body' : undefined}
        onClose={() => settle(false)}
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-card border border-line bg-bg p-6 text-text shadow-card"
      >
        {options && (
          <>
            <h2 id="confirm-title" className="text-lg">
              {options.title}
            </h2>
            {options.body && (
              <p id="confirm-body" className="mt-2 text-sm leading-loose text-muted">
                {options.body}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => settle(false)} autoFocus>
                إلغاء
              </Button>
              <Button variant={options.tone === 'danger' ? 'danger' : 'primary'} onClick={() => settle(true)}>
                {options.confirmLabel ?? 'تأكيد'}
              </Button>
            </div>
          </>
        )}
      </dialog>
    </ConfirmContext.Provider>
  )
}
