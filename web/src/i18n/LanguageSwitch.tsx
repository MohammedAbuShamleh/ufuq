'use client'

import { usePathname } from 'next/navigation'
import { href, stripLocale, type Locale } from './config'
import { useLocale } from './LocaleProvider'

/** Each language named in itself, the same on every page: the visitor looks for their own. */
const NAMES: Record<Locale, { name: string; short: string }> = {
  ar: { name: 'العربية', short: 'ع' },
  en: { name: 'English', short: 'EN' },
}

const OTHER: Record<Locale, Locale> = { ar: 'en', en: 'ar' }

/**
 * The same page in the other language. A plain link, not a client
 * navigation, so the document's language and direction start fresh.
 * `short` draws it as a round button with the language's short name.
 * `lang` without `dir`: one word reads right either way, and its own dir
 * would flip the link's inline sides (the footer's separators).
 */
export function LanguageSwitch({ short, className }: { short?: boolean; className?: string }) {
  const { locale, switchTo } = useLocale()
  const path = stripLocale(usePathname())
  const other = OTHER[locale]
  const { name, short: abbr } = NAMES[other]

  return (
    <a
      href={href(other, switchTo ?? path)}
      hrefLang={other}
      lang={other}
      className={className}
      aria-label={short ? name : undefined}
      title={short ? name : undefined}
    >
      {short ? abbr : name}
    </a>
  )
}
