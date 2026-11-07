'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import { formatNumber } from '@/lib/format'

/** A filter pill with its count; a filter with nothing behind it cannot be picked. */
export function FilterButton({ on, onClick, label, count }: { on: boolean; onClick: () => void; label: string; count: number }) {
  const { locale } = useLocale()
  return (
    <button type="button" className={on ? 'on' : undefined} aria-pressed={on} disabled={count === 0 && !on} onClick={onClick}>
      {label} <i>{formatNumber(locale, count)}</i>
    </button>
  )
}
