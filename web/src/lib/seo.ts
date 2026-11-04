import type { Metadata } from 'next'

/** The public address: canonical links, share previews, the sitemap. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const SITE_NAME = 'أفق | UFUQ'

export const SITE_DESCRIPTION =
  'أفق شركة برمجيات من غزة، تبني أنظمة وبرمجيات للجمعيات والمدارس والشركات منذ ٢٠٢٢: منصات، وأنظمة ERP ومالية، وتطبيقات جوال، ومواقع.'

export const DEFAULT_OG_IMAGE = {
  url: '/og/og-ufuq-ar.png',
  width: 1200,
  height: 630,
  alt: 'أفق | UFUQ — أنظمة وبرمجيات للجمعيات والمدارس والشركات',
}

type PageMeta = {
  title: string
  description: string
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
export function pageMetadata({ title, description, path, ownImage = false }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'ar_AR',
      title: `${title} · ${SITE_NAME}`,
      description,
      url: path,
      ...(ownImage ? {} : { images: [DEFAULT_OG_IMAGE] }),
    },
  }
}
