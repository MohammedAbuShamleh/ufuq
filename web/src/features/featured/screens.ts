import { arNum } from '@/lib/format'
import type { CardTheme, ProjectType, Screen } from '@/lib/types'

/** Each card theme's look (CSS class) and its button. */
export const THEMES: Record<CardTheme, { className: string; button: 'sd' | 'amber' | 'nx' | 'line' }> = {
  linen: { className: 'saiid', button: 'sd' },
  ink: { className: 'dark itqan', button: 'amber' },
  sand: { className: 'nexa', button: 'nx' },
  charcoal: { className: 'rasras', button: 'line' },
}

/** «I want something like this»: the button text and the project type it picks in the contact form. */
export const SIMILAR: Record<ProjectType, { label: string; formType: string }> = {
  platform: { label: 'أريد منصة مشابهة', formType: 'منصة إلكترونية' },
  app: { label: 'أريد تطبيقاً مشابهاً', formType: 'تطبيق جوال' },
  website: { label: 'أريد موقعاً مشابهاً', formType: 'موقع إبداعي' },
  system: { label: 'أريد نظاماً مشابهاً', formType: 'نظام ERP' },
}

export type Keyed = { key: string; screen: Screen }
export type Phone = { kind: 'stack'; shots: Keyed[] } | { kind: 'static'; screen: Screen }

/**
 * Sorts a project's screens into what the card draws:
 * - tabs: one per tab_key of the desktop/video screens, in order;
 * - desktop: the shots in the browser frame, each under its tab;
 * - phones (two at most): mobile screens with a tab_key follow the tabs (the
 *   first of each key in the first phone, the second in the next); mobile
 *   screens without one stand still.
 */
export function arrangeScreens(screens: Screen[]) {
  const tabs: { key: string; label: string }[] = []
  const desktop: Keyed[] = []

  screens
    .filter((s) => s.kind !== 'mobile' && s.file)
    .forEach((screen, i) => {
      const key = screen.tab_key ?? `shot-${i}`
      if (!tabs.some((t) => t.key === key)) tabs.push({ key, label: screen.tab_label ?? arNum(tabs.length + 1) })
      desktop.push({ key, screen })
    })

  const mobile = screens.filter((s) => s.kind === 'mobile' && s.file)
  const stacks: Keyed[][] = []
  const seen = new Map<string, number>()
  for (const screen of mobile.filter((s) => s.tab_key)) {
    const key = screen.tab_key!
    const n = seen.get(key) ?? 0
    seen.set(key, n + 1)
    ;(stacks[n] ??= []).push({ key, screen })
  }

  const phones: Phone[] = [
    ...stacks.map((shots) => ({ kind: 'stack' as const, shots })),
    ...mobile.filter((s) => !s.tab_key).map((screen) => ({ kind: 'static' as const, screen })),
  ].slice(0, 2)

  const first = desktop[0]?.screen.file
  const ratio = first?.width && first.height ? `${first.width}/${first.height}` : '1600/1000'

  return { tabs, desktop, phones, ratio }
}
