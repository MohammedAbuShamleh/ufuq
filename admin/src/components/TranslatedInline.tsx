import { LOCALES, type Locale, type T } from '@/lib/i18n'
import { TextField } from './ui/Field'
import { FieldLocale } from './ui/fieldLocale'

type Props = {
  label: string
  value: T
  onChange: (value: T) => void
  required?: boolean
  max?: number
  hint?: string
  placeholder?: string
  errorFor?: (locale: Locale) => string | undefined
}

/**
 * A short translated field inside a small card (a screen's alt text), where a
 * full tab strip would crowd the layout: one input per language, labelled with
 * the language. The hint is said once, under the Arabic one.
 */
export function TranslatedInline({ label, value, onChange, errorFor, hint, ...rest }: Props) {
  return (
    <>
      {LOCALES.map((l, i) => (
        <FieldLocale.Provider key={l.code} value={{ code: l.code, dir: l.dir, primary: i === 0 }}>
          <TextField
            {...rest}
            label={LOCALES.length > 1 ? `${label} (${l.label})` : label}
            hint={i === 0 ? hint : undefined}
            value={value[l.code] ?? ''}
            onChange={(v) => onChange({ ...value, [l.code]: v })}
            error={errorFor?.(l.code)}
          />
        </FieldLocale.Provider>
      ))}
    </>
  )
}
