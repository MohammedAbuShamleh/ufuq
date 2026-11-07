import type { Locale } from '@/lib/i18n'
import { Badge } from './Page'

/** «EN» on a list row whose item also shows on the English site (its English is complete). */
export function EnglishBadge({ locales }: { locales: Locale[] | undefined }) {
  if (!locales?.includes('en')) return null

  return (
    <span title="يظهر في النسخة الإنجليزية من الموقع">
      <Badge>
        <span lang="en" aria-hidden="true">
          EN
        </span>
        <span className="sr-only">بالإنجليزية أيضاً</span>
      </Badge>
    </span>
  )
}
