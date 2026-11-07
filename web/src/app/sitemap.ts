import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE, href, LOCALES, type Locale } from '@/i18n/config'
import { getProjects } from '@/lib/api'
import { SITE_URL } from '@/lib/seo'

/**
 * Every public page in every language it exists in, from the same data the
 * pages use: a project appears once it is published, and in English once it
 * is translated. Each entry names its other languages (hreflang). No
 * lastModified: the API does not say when content changed, and a made-up
 * date is worse than none.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A route handler: it cannot read the [lang] segment, so it names the language.
  // The Arabic list has every published project, with the languages each one has.
  const projects = await getProjects(DEFAULT_LOCALE)
  const url = (locale: Locale, path: string) => new URL(href(locale, path), SITE_URL).href

  const page = (path: string, priority: number, locales: readonly Locale[] = LOCALES) => {
    const shown = LOCALES.filter((l) => locales.includes(l))
    const languages = shown.length > 1 ? Object.fromEntries(shown.map((l) => [l, url(l, path)])) : undefined
    return shown.map((locale) => ({ url: url(locale, path), priority, ...(languages && { alternates: { languages } }) }))
  }

  return [
    page('/', 1),
    page('/work', 0.8),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.6, p.locales)),
    page('/about', 0.7),
    page('/privacy', 0.2),
  ].flat()
}
