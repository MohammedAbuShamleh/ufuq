// Arabic-Indic digits, as the site writes them.
const LOCALE = 'ar-u-nu-arab'
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' })
const number = new Intl.NumberFormat(LOCALE)
const plural = new Intl.PluralRules('ar')

export const formatDateTime = (iso: string | null | undefined) => (iso ? dateTime.format(new Date(iso)) : '—')

export const formatNumber = (n: number) => number.format(n)

/** A count with the noun Arabic grammar asks for: «شاشة واحدة», «شاشتان», «٣ شاشات», «١١ شاشة». */
export function formatCount(n: number, forms: { zero: string; one: string; two: string; few: string; many: string }) {
  const category = n === 0 ? 'zero' : plural.select(n)
  if (category === 'zero') return forms.zero
  if (category === 'one') return forms.one
  if (category === 'two') return forms.two
  return `${number.format(n)} ${category === 'few' ? forms.few : forms.many}`
}

/** «٣ ميغابايت»: the upload limits as people read them. */
export const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${number.format(Math.round((bytes / 1024 / 1024) * 10) / 10)} ميغابايت` : `${number.format(Math.ceil(bytes / 1024))} كيلوبايت`

/** Pending content is null or a [bracketed] placeholder (see the public API). */
export const isPending = (text: string | null | undefined) => !text || /^\[.*\]$/.test(text.trim())
