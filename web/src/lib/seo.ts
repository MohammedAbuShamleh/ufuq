import type { Metadata } from 'next'
import { DEFAULT_LOCALE, href, LOCALES, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/ar'

/** The public address: canonical links, share previews, the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const OG_LOCALE: Record<Locale, string> = { ar: 'ar_AR', en: 'en_US' }

/** The site's share preview, drawn once per language (public/og). */
const shareImage = (locale: Locale, t: Dictionary) => ({
  url: `/og/og-ufuq-${locale}.png`,
  width: 1200,
  height: 630,
  alt: t.meta.shareImageAlt,
})

const hasEvery = (locales: readonly Locale[]) => LOCALES.every((l) => locales.includes(l))

/**
 * The canonical address, and the page in each language when it exists in
 * all of them (hreflang). x-default is the Arabic page, the site's own.
 * A page in one language only names no alternates: one would point at a 404.
 */
export function alternates(locale: Locale, path: string, locales: readonly Locale[] = LOCALES): Metadata['alternates'] {
  const canonical = href(locale, path)
  if (!hasEvery(locales)) return { canonical }
  const languages = Object.fromEntries(LOCALES.map((l) => [l, href(l, path)]))
  return { canonical, languages: { ...languages, 'x-default': href(DEFAULT_LOCALE, path) } }
}

/** og:locale:alternate: the other languages, again only for a page that has them. */
const alternateLocale = (locale: Locale, locales: readonly Locale[] = LOCALES) =>
  hasEvery(locales) ? LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]) : undefined

/** The home page's metadata, and every other page's defaults (the root layout's). */
export function siteMetadata(locale: Locale, t: Dictionary): Metadata {
  const { siteName, description } = t.meta
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${siteName} — ${t.meta.homeTitle}`, template: `%s · ${siteName}` },
    description,
    openGraph: {
      type: 'website',
      siteName,
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocale(locale),
      title: `${siteName} — ${t.meta.homeShareTitle}`,
      description,
      images: [shareImage(locale, t)],
    },
    twitter: { card: 'summary_large_image' },
  }
}

type PageMeta = {
  locale: Locale
  t: Dictionary
  title: string
  description: string
  /** The page's address without a language prefix, e.g. /about. */
  path: string
  /** The page's own share image (an opengraph-image route) in place of the site's. */
  image?: { url: string; alt: string }
  /** The languages the page exists in, when not all of them (a project not yet translated). */
  locales?: readonly Locale[]
}

/**
 * A page's title, description, alternates and share preview. A page's
 * openGraph replaces the layout's as a whole (Next merges metadata
 * shallowly), so every page repeats the shared fields through here.
 */
export function pageMetadata({ locale, t, title, description, path, image, locales }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, path, locales),
    openGraph: {
      type: 'website',
      siteName: t.meta.siteName,
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocale(locale, locales),
      title: `${title} · ${t.meta.siteName}`,
      description,
      url: href(locale, path),
      images: [image ? { ...image, width: 1200, height: 630, type: 'image/jpeg' } : shareImage(locale, t)],
    },
  }
}
