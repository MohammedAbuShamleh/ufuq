import { useId, useState, type ReactNode } from 'react'
import { isErrorIn, LOCALES, type Locale } from '@/lib/i18n'
import { FieldLocale } from './ui/fieldLocale'

type Props = {
  title?: string
  /** The form's field errors: a language tab holding one is marked, and opened after a failed save. */
  errors?: Record<string, string>
  /** The fields this card shows (first path segment), so errors elsewhere in the form do not mark it. */
  fields?: readonly string[]
  children: (locale: Locale) => ReactNode
}

/** The translated fields of a form, under one tab per language. */
export function Translated({ title, errors, fields, children }: Props) {
  const id = useId()
  const [active, setActive] = useState<Locale>(LOCALES[0].code)

  const keys = Object.keys(errors ?? {}).filter((k) => !fields || fields.includes(k.split('.')[0]))
  const failing = LOCALES.filter((l) => keys.some((k) => isErrorIn(k, l.code))).map((l) => l.code)

  // When a save fails anew, open the language holding the error, unless the open one has one too.
  const failingKey = failing.join(',')
  const [seen, setSeen] = useState(failingKey)
  if (seen !== failingKey) {
    setSeen(failingKey)
    if (failing.length > 0 && !failing.includes(active)) setActive(failing[0])
  }

  return (
    <section className="rounded-card border border-line bg-bg">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 pt-3">
        <div role="tablist" aria-label="لغة النص" className="flex gap-1">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              id={`${id}-${l.code}-tab`}
              type="button"
              role="tab"
              aria-selected={l.code === active}
              aria-controls={`${id}-${l.code}`}
              onClick={() => setActive(l.code)}
              className={`-mb-px inline-flex cursor-pointer items-center gap-1.5 border-b-2 px-3 pb-2.5 font-display text-sm transition-colors ${
                l.code === active ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {l.label}
              {failing.includes(l.code) && (
                <>
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-danger" />
                  <span className="sr-only">(فيها خطأ)</span>
                </>
              )}
            </button>
          ))}
        </div>
        {title && <h2 className="pb-2.5 font-display text-sm text-muted">{title}</h2>}
      </div>
      {LOCALES.map((l, i) => (
        // The labels stay Arabic; only the inputs take the tab's language (FieldLocale).
        <div key={l.code} id={`${id}-${l.code}`} role="tabpanel" aria-labelledby={`${id}-${l.code}-tab`} hidden={l.code !== active} className="grid gap-5 p-5">
          {i > 0 && <p className="text-xs leading-relaxed text-muted">اختياري. يظهر العنصر في النسخة الإنجليزية من الموقع بعد أن تُكتب بالإنجليزية كل حقوله المطلوبة بالعربية، وإلا بقي في العربية وحدها.</p>}
          <FieldLocale.Provider value={{ code: l.code, dir: l.dir, primary: i === 0 }}>{children(l.code)}</FieldLocale.Provider>
        </div>
      ))}
    </section>
  )
}
