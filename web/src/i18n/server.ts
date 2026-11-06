import { notFound } from 'next/navigation'
import { lang } from 'next/root-params'
import { hasLocale, type Locale } from './config'
import { ar, type Dictionary } from './dictionaries/ar'
import { en } from './dictionaries/en'

// Server only: next/root-params fails the build if a client component imports this.

const DICTIONARIES: Record<Locale, Dictionary> = { ar, en }

/** The language of the page being rendered, from the [lang] segment. Any other value is a 404. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang()
  if (!hasLocale(locale)) notFound()
  return locale
}

/**
 * The words for a language: the page's own unless one is named. Route
 * handlers and 'use cache' functions name it, since they cannot read the segment.
 */
export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return DICTIONARIES[locale ?? (await getLocale())]
}
