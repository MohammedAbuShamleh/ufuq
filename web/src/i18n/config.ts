// The site's languages. Safe to import anywhere, client code included: no
// dictionary and no server API here (those are in ./server.ts).

export const LOCALES = ['ar', 'en'] as const

export type Locale = (typeof LOCALES)[number]

/** Arabic is served at / with no prefix; every other language under /{locale}. */
export const DEFAULT_LOCALE: Locale = 'ar'

export type Dir = 'rtl' | 'ltr'

export const hasLocale = (value: string | undefined): value is Locale => (LOCALES as readonly string[]).includes(value ?? '')

export const dirOf = (locale: Locale): Dir => (locale === 'ar' ? 'rtl' : 'ltr')

/**
 * An internal address in a language: the path as is for Arabic, behind
 * /{locale} otherwise. Same-page anchors (#contact) and outside addresses
 * pass through.
 *
 *   href('ar', '/about')          → /about
 *   href('en', '/about')          → /en/about
 *   href('en', '/')               → /en
 *   href('en', '/?type=app#form') → /en?type=app#form
 */
export function href(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE || !path.startsWith('/') || path.startsWith('//')) return path
  if (path === '/' || path[1] === '?' || path[1] === '#') return `/${locale}${path.slice(1)}`
  return `/${locale}${path}`
}

/** The address without its language prefix: /en/work → /work, /en → /. */
export function stripLocale(pathname: string): string {
  const [, first] = pathname.split('/')
  if (!hasLocale(first)) return pathname
  return pathname.slice(first.length + 1) || '/'
}

/** Fills {name} slots in a dictionary string: fill('شاشات {title}', { title }) */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (slot, name: string) => (name in values ? String(values[name]) : slot))
}

/**
 * fill() for words on the page: each slot stays its own text node, the way JSX
 * `{a} من {b}` renders, so the text shapes exactly as it did before.
 */
export function fillNodes(template: string, values: Record<string, string | number>): (string | number)[] {
  return template
    .split(/\{(\w+)\}/)
    .map((part, i) => (i % 2 ? (values[part] ?? `{${part}}`) : part))
    .filter((part) => part !== '')
}
