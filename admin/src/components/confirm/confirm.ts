import { createContext, useContext } from 'react'

export type ConfirmOptions = {
  title: string
  body?: string
  confirmLabel?: string
  tone?: 'danger' | 'default'
}

export type Confirm = (options: ConfirmOptions) => Promise<boolean>

export const ConfirmContext = createContext<Confirm | null>(null)

export function useConfirm(): Confirm {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}

/**
 * Content deletes are soft: say the item leaves the site, and that it can still
 * be recovered. Users are removed for good, so their dialog says that instead.
 */
export const deleteOptions = (name: string, permanent = false): ConfirmOptions => ({
  title: `حذف «${name}»؟`,
  body: permanent
    ? 'لن يستطيع الدخول إلى اللوحة بعد الآن، ولا يمكن التراجع عن ذلك.'
    : 'سيختفي من الموقع ومن اللوحة فوراً. يبقى محفوظاً في قاعدة البيانات إن احتجتم استعادته لاحقاً.',
  confirmLabel: 'نعم، احذف',
  tone: 'danger',
})
