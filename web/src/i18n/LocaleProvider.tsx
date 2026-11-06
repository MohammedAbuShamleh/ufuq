'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { dirOf, DEFAULT_LOCALE, type Dir, type Locale } from './config'

type Value = { locale: Locale; dir: Dir }

const LocaleContext = createContext<Value>({ locale: DEFAULT_LOCALE, dir: dirOf(DEFAULT_LOCALE) })

/** Set once by the root layout. Client code reads the language here; its words arrive as props. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={{ locale, dir: dirOf(locale) }}>{children}</LocaleContext>
}

export const useLocale = () => useContext(LocaleContext)
