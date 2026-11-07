import { href, type Locale } from '@/i18n/config'
import type { LeadType } from '@/i18n/dictionaries/ar'
import type { ProjectType } from '@/lib/types'

/**
 * «I want something like this»: the project kind it picks in the contact form.
 * The link's words are in the dictionary (layouts.similar).
 */
export const SIMILAR: Record<ProjectType, LeadType> = {
  platform: 'platform',
  app: 'app',
  website: 'website',
  system: 'system',
}

/** From another page: the home contact form, with the project kind picked through ?type=. */
export const similarHref = (locale: Locale, type: ProjectType) => href(locale, `/?type=${SIMILAR[type]}#contact`)
