import { createContext, useContext } from 'react'
import type { Locale } from '@/lib/i18n'

export type FieldLocaleValue = { code: Locale; dir: 'rtl' | 'ltr'; primary: boolean }

/**
 * The language of the inputs inside a translated card (one tab or inline field
 * per language); null outside one. Text fields read it to set their direction
 * and, in a second language, to drop the «required» mark and the Arabic
 * examples: English is optional, whole or empty.
 */
export const FieldLocale = createContext<FieldLocaleValue | null>(null)

export const useFieldLocale = () => useContext(FieldLocale)
