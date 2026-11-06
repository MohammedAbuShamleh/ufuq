// Translated fields. Every form renders its translated fields once per entry in
// LOCALES, so a language is added here, not in each form.

export type Locale = 'ar' | 'en'

/** A translated text as the API sends and receives it: {"ar": "…", "en": "…"}. */
export type T = Partial<Record<Locale, string | null>>

export const LOCALES: readonly { code: Locale; label: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' },
]

/** The Arabic text, or an empty string while it is still missing. */
export const ar = (t: T | null | undefined): string => t?.ar ?? ''

/** An empty translated value for new records. */
export const blank = (): T => ({ ar: '', en: '' })

/** Normalises a translated value from the API so inputs are always controlled. */
export const tr = (t: T | null | undefined): T => ({ ...t, ar: t?.ar ?? '', en: t?.en ?? '' })

/** True when an error key (`title.en`, `privacy_policy.en.0.heading`) belongs to that language. */
export const isErrorIn = (key: string, locale: Locale) => key.split('.').includes(locale)
