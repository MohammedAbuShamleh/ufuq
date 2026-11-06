import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from './i18n/config'

/**
 * Every page lives under app/[lang]. Arabic keeps its addresses with no
 * prefix: / is served from /ar, and /ar/... sends the visitor back to the
 * unprefixed address. Other languages have theirs (/en/...). The browser's
 * language is never consulted: the address alone says which one to show.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, first] = pathname.split('/')

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  if ((LOCALES as readonly string[]).includes(first)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Not Next's own files, the API routes, files (anything with an extension:
  // icon.svg, sitemap.xml, public/...), or share images, whose addresses Next
  // writes with the language already in them (/ar/work/x/opengraph-image).
  matcher: ['/((?!_next/|api/|.*\\..*|.*opengraph-image).*)'],
}
