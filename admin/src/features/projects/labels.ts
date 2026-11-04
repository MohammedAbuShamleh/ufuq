import type { CardTheme, ProjectSector, ProjectType, ScreenKind } from './types'

export const TYPE_OPTIONS: readonly { value: ProjectType; label: string }[] = [
  { value: 'system', label: 'نظام' },
  { value: 'website', label: 'موقع' },
  { value: 'platform', label: 'منصة' },
  { value: 'app', label: 'تطبيق جوال' },
]

export const SECTOR_OPTIONS: readonly { value: ProjectSector; label: string }[] = [
  { value: 'charity', label: 'جمعيات خيرية' },
  { value: 'education', label: 'مدارس وتعليم' },
  { value: 'government', label: 'جهات حكومية' },
  { value: 'dawah', label: 'دعوة وتحفيظ' },
  { value: 'business', label: 'شركات' },
]

/** The countries the work runs in today; the site shows the same names. */
export const COUNTRY_OPTIONS: readonly { value: string; label: string }[] = [
  { value: 'PS', label: 'فلسطين' },
  { value: 'EG', label: 'مصر' },
  { value: 'AE', label: 'الإمارات' },
  { value: 'TR', label: 'تركيا' },
]

export const THEME_OPTIONS: readonly { value: CardTheme; label: string }[] = [
  { value: 'linen', label: 'كتّاني فاتح' },
  { value: 'ink', label: 'حبري داكن' },
  { value: 'sand', label: 'رملي' },
  { value: 'charcoal', label: 'فحمي' },
]

export const KIND_OPTIONS: readonly { value: ScreenKind; label: string }[] = [
  { value: 'desktop', label: 'شاشة حاسوب' },
  { value: 'mobile', label: 'شاشة جوال' },
  { value: 'video', label: 'فيديو' },
]

export const label = <V extends string>(options: readonly { value: V; label: string }[], value: V | null) => options.find((o) => o.value === value)?.label ?? ''
