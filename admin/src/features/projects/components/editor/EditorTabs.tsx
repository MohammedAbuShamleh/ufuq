import { useEffect, useRef, type KeyboardEvent } from 'react'
import { formatNumber } from '@/lib/format'
import { TABS, type EditorTab } from './tabProps'

type Props = { active: EditorTab; onChange: (tab: EditorTab) => void; withErrors: EditorTab[]; counts: Partial<Record<EditorTab, number>> }

/** The project form's sections. Arrow keys move between them (reading order is right to left). */
export function EditorTabs({ active, onChange, withErrors, counts }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  // On a phone the bar scrolls sideways: keep the open tab in sight (a new project opens on «الشاشات»).
  useEffect(() => {
    refs.current[TABS.findIndex((t) => t.key === active)]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (TABS.findIndex((t) => t.key === active) + step + TABS.length) % TABS.length
    onChange(TABS[next].key)
    refs.current[next]?.focus()
  }

  return (
    <div role="tablist" aria-label="أقسام المشروع" onKeyDown={onKey} className="-mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
      {TABS.map((t, i) => {
        const selected = t.key === active
        return (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el
            }}
            id={`tab-${t.key}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="project-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.key)}
            className={`-mb-px inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-2.5 pb-3 sm:px-3.5 font-display text-sm whitespace-nowrap transition-colors ${
              selected ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {t.label}
            {counts[t.key] !== undefined && <span className="rounded-pill bg-surface px-1.5 text-xs text-muted">{formatNumber(counts[t.key] ?? 0)}</span>}
            {withErrors.includes(t.key) && (
              <>
                <span aria-hidden="true" className="size-2 rounded-full bg-danger" />
                <span className="sr-only">(فيه أخطاء)</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
