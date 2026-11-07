'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dirOf, DEFAULT_LOCALE, type Dir, type Locale } from './config'

type Value = {
  locale: Locale
  dir: Dir
  /** Where the language switch goes instead of this page (a page the other language does not have). */
  switchTo: string | null
  setSwitchTo: (path: string | null) => void
}

const LocaleContext = createContext<Value>({ locale: DEFAULT_LOCALE, dir: dirOf(DEFAULT_LOCALE), switchTo: null, setSwitchTo: () => {} })

/** Set once by the root layout. Client code reads the language here; its words arrive as props. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [switchTo, setSwitchTo] = useState<string | null>(null)
  return <LocaleContext value={{ locale, dir: dirOf(locale), switchTo, setSwitchTo }}>{children}</LocaleContext>
}

export const useLocale = () => useContext(LocaleContext)

/**
 * Rendered by a page that has no version in the other language (a project
 * not yet translated): while it is open, the language switch goes to `path`
 * in that language instead of to a missing page.
 */
export function SwitchTarget({ path }: { path: string }) {
  const { setSwitchTo } = useLocale()
  useEffect(() => {
    setSwitchTo(path)
    return () => setSwitchTo(null)
  }, [path, setSwitchTo])
  return null
}
