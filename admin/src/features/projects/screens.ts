import { imageSize } from '@/components/upload/files'
import { formatNumber } from '@/lib/format'
import { ar } from '@/lib/i18n'
import type { Screen, ScreenKind } from './types'

/** A phone shot is clearly taller than wide; anything else sits in the browser frame. */
export async function detectKind(file: File, url: string): Promise<ScreenKind> {
  if (file.type.startsWith('video/')) return 'video'
  const size = await imageSize(url)
  return size && size.height > size.width * 1.3 ? 'mobile' : 'desktop'
}

/** The next free "tab-N" key, so new desktop shots never collide with existing tabs. */
export function nextTabKey(taken: (string | null)[]): string {
  const numbers = taken.map((k) => /^tab-(\d+)$/.exec(k ?? '')?.[1]).filter(Boolean).map(Number)
  return `tab-${Math.max(0, ...numbers) + 1}`
}

export type TabOption = { key: string; label: string }

/** The desktop tabs a phone shot can follow, named as the site names them. */
export function tabOptions(screens: { kind: ScreenKind; tab_key: string | null; tab_label: Screen['tab_label'] }[]): TabOption[] {
  const tabs: TabOption[] = []
  for (const s of screens) {
    if (s.kind === 'mobile' || !s.tab_key || tabs.some((t) => t.key === s.tab_key)) continue
    tabs.push({ key: s.tab_key, label: ar(s.tab_label) || `التبويب ${formatNumber(tabs.length + 1)}` })
  }
  return tabs
}

export const KIND_HINT: Record<ScreenKind, string> = {
  desktop: 'تظهر داخل إطار المتصفح، وكل شاشة تبويب فوقه.',
  mobile: 'تظهر داخل الجوال بجانب إطار المتصفح.',
  video: 'يُعرض بدل صورة داخل إطار المتصفح، دون صوت.',
}
