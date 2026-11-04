// Translated fields. Today the team writes Arabic only; adding English later
// means adding one entry to LOCALES — every form renders its translated
// fields once per entry, so no form changes.

export type Locale = 'ar' | 'en'

/** A translated text as the API sends and receives it: {"ar": "…"}. */
export type T = Partial<Record<Locale, string | null>>

export const LOCALES: readonly { code: Locale; label: string; dir: 'rtl' | 'ltr' }[] = [{ code: 'ar', label: 'العربية', dir: 'rtl' }]

/** The Arabic text, or an empty string while it is still missing. */
export const ar = (t: T | null | undefined): string => t?.ar ?? ''

/** An empty translated value for new records. */
export const blank = (): T => ({ ar: '' })

/** Normalises a translated value from the API so inputs are always controlled. */
export const tr = (t: T | null | undefined): T => ({ ...t, ar: t?.ar ?? '' })
