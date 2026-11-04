import { useId, useState, type ReactNode } from 'react'
import { LOCALES, type Locale } from '@/lib/i18n'

/**
 * The translated fields of a form, under one tab per language. Today there is
 * only «العربية»; adding English to LOCALES adds its tab to every form.
 */
export function Translated({ title, children }: { title?: string; children: (locale: Locale) => ReactNode }) {
  const id = useId()
  const [active, setActive] = useState<Locale>(LOCALES[0].code)

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
              className={`-mb-px cursor-pointer border-b-2 px-3 pb-2.5 font-display text-sm transition-colors ${
                l.code === active ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        {title && <h2 className="pb-2.5 font-display text-sm text-muted">{title}</h2>}
      </div>
      {LOCALES.map((l) => (
        <div key={l.code} id={`${id}-${l.code}`} role="tabpanel" aria-labelledby={`${id}-${l.code}-tab`} hidden={l.code !== active} dir={l.dir} className="grid gap-5 p-5">
          {children(l.code)}
        </div>
      ))}
    </section>
  )
}
