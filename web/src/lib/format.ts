import type { Locale } from '@/i18n/config'

// Arabic-Indic digits wherever an Arabic page shows a number (٥٠، ٨٨، ٢٠٢٢);
// Western digits in English.
const NUMBERING: Record<Locale, string> = { ar: 'ar-u-nu-arab', en: 'en' }
const formats = new Map<string, Intl.NumberFormat>()

/** A count in the page's digits, grouped (٢٬٠٢٢). `options` for other shapes, such as two digits (٠٧). */
export function formatNumber(locale: Locale, n: number, options?: Intl.NumberFormatOptions) {
  const key = `${locale}${JSON.stringify(options ?? {})}`
  let format = formats.get(key)
  if (!format) formats.set(key, (format = new Intl.NumberFormat(NUMBERING[locale], options)))
  return format.format(n)
}

/** Years and codes: no thousands separator (٢٠٢٢, not ٢٬٠٢٢). */
export const formatYear = (locale: Locale, n: number) => formatNumber(locale, n, { useGrouping: false })

/** Content still waiting for real text: null, or a [bracketed] placeholder. */
export const isPending = (text: string | null | undefined): text is null | undefined | `[${string}]` =>
  text == null || /^\s*\[[\s\S]*\]\s*$/.test(text)

/**
 * Placeholders and links with no address show, marked as pending, only in a
 * preview build (NEXT_PUBLIC_SHOW_PENDING=1) so the client can see what is
 * still missing. On the live site the element is left out instead.
 */
export const SHOW_PENDING = process.env.NEXT_PUBLIC_SHOW_PENDING === '1'

/** Real text always renders; a placeholder only in a preview build. */
export const isShown = (text: string | null | undefined) => SHOW_PENDING || !isPending(text)

/** wa.me wants digits only, with the country code. */
export const whatsappLink = (number: string | null, text?: string) =>
  number ? `https://wa.me/${number.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null
