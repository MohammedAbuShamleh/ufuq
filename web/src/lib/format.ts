// Arabic-Indic digits everywhere the visitor reads a number (٥٠، ٨٨، ٢٠٢٢).
const counts = new Intl.NumberFormat('ar-u-nu-arab')
const plain = new Intl.NumberFormat('ar-u-nu-arab', { useGrouping: false })

export const arNum = (n: number) => counts.format(n)

/** Years and codes: no thousands separator (٢٠٢٢, not ٢٬٠٢٢). */
export const arYear = (n: number) => plain.format(n)

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
