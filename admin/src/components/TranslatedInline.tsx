import { LOCALES, type Locale, type T } from '@/lib/i18n'
import { TextField } from './ui/Field'

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
 * the language once there is more than one.
 */
export function TranslatedInline({ label, value, onChange, errorFor, ...rest }: Props) {
  return (
    <>
      {LOCALES.map((l) => (
        <TextField
          key={l.code}
          {...rest}
          label={LOCALES.length > 1 ? `${label} (${l.label})` : label}
          dir={l.dir}
          value={value[l.code] ?? ''}
          onChange={(v) => onChange({ ...value, [l.code]: v })}
          error={errorFor?.(l.code)}
        />
      ))}
    </>
  )
}
