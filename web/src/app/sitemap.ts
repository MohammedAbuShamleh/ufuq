import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE } from '@/i18n/config'
import { getProjects } from '@/lib/api'
import { SITE_URL } from '@/lib/seo'

/**
 * Every public page, from the same data the pages use: a project appears
 * here once it is published. No lastModified: the API does not say when
 * content changed, and a made-up date is worse than none.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A route handler: it cannot read the [lang] segment, so it names the language.
  // These are the Arabic addresses (no prefix).
  const projects = await getProjects(DEFAULT_LOCALE)
  const page = (path: string, priority: number) => ({ url: new URL(path, SITE_URL).href, priority })

  return [
    page('/', 1),
    page('/work', 0.8),
    ...projects.map((p) => page(`/work/${p.slug}`, 0.6)),
    page('/about', 0.7),
    page('/privacy', 0.2),
  ]
}
