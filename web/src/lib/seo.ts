import type { Metadata } from 'next'
import { href, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/ar'

/** The public address: canonical links, share previews, the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const OG_LOCALE: Record<Locale, string> = { ar: 'ar_AR', en: 'en_US' }

const shareImage = (t: Dictionary) => ({
  url: '/og/og-ufuq-ar.png',
  width: 1200,
  height: 630,
  alt: t.meta.shareImageAlt,
})

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
      title: `${siteName} — ${t.meta.homeShareTitle}`,
      description,
      images: [shareImage(t)],
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
  /** The page has an opengraph-image file of its own. */
  ownImage?: boolean
}

/**
 * A page's title, description and share preview. A page's openGraph replaces
 * the layout's as a whole (Next merges metadata shallowly), so every page
 * repeats the shared fields through here. Next uses an opengraph-image file
 * only when openGraph has no images key at all, hence ownImage.
 */
export function pageMetadata({ locale, t, title, description, path, ownImage = false }: PageMeta): Metadata {
  const url = href(locale, path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: t.meta.siteName,
      locale: OG_LOCALE[locale],
      title: `${title} · ${t.meta.siteName}`,
      description,
      url,
      ...(ownImage ? {} : { images: [shareImage(t)] }),
    },
  }
}
