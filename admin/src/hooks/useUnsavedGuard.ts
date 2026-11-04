import { useEffect, useRef } from 'react'
import { useBlocker } from 'react-router'
import { useConfirm } from '@/components/confirm/confirm'

/**
 * Asks before leaving a form with unsaved edits — inside the dashboard through
 * our dialog, on reload or tab close through the browser's own prompt.
 * Call release() right before navigating away on purpose (after a save).
 */
export function useUnsavedGuard(dirty: boolean) {
  const dirtyRef = useRef(dirty)
  const asking = useRef(false)
  const confirm = useConfirm()

  useEffect(() => {
    dirtyRef.current = dirty
  }, [dirty])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirtyRef.current && currentLocation.pathname !== nextLocation.pathname)

  useEffect(() => {
    if (blocker.state !== 'blocked' || asking.current) return
    asking.current = true
    void confirm({
      title: 'تعديلات غير محفوظة',
      body: 'لم تحفظ تعديلاتك على هذه الصفحة. إن غادرت الآن ستضيع.',
      confirmLabel: 'غادر دون حفظ',
      tone: 'danger',
    }).then((leave) => {
      asking.current = false
      if (leave) blocker.proceed()
      else blocker.reset()
    })
  }, [blocker, confirm])

  useEffect(() => {
    if (!dirty) return
    const onUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [dirty])

  return {
    release: () => {
      dirtyRef.current = false
    },
  }
}
