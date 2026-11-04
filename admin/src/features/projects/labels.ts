import type { FeaturedLayout, ProjectSector, ProjectType, ScreenKind } from './types'

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

export const LAYOUT_OPTIONS: readonly { value: FeaturedLayout; label: string }[] = [
  { value: 'showcase', label: 'واجهة وشاشات' },
  { value: 'phones', label: 'هواتف' },
  { value: 'sheet', label: 'لوحة شاشات' },
  { value: 'reel', label: 'عرض متحرك' },
]

/** What each layout draws in «أعمالنا», from which screens. */
export const LAYOUT_HINT: Record<FeaturedLayout, string> = {
  showcase: 'شاشة حاسوب كبيرة وتحتها كل شاشات الحاسوب مصغّرة بتسمياتها، والأرقام البارزة بجانب العنوان.',
  phones: 'شريط داكن فيه أول ثلاث شاشات جوال، الوسطى أكبر، وتحت كل منها تسميتها.',
  sheet: 'النص والنقاط في الأعلى، ثم كل شاشات الحاسوب في لوحة، وتُكبَّر الشاشة بالضغط عليها.',
  reel: 'مسرح كبير يعرض الفيديو وشاشات الحاسوب، وتحته زر بتسمية كل شاشة للتبديل بينها.',
}

export const KIND_OPTIONS: readonly { value: ScreenKind; label: string }[] = [
  { value: 'desktop', label: 'شاشة حاسوب' },
  { value: 'mobile', label: 'شاشة جوال' },
  { value: 'video', label: 'فيديو' },
]

export const label = <V extends string>(options: readonly { value: V; label: string }[], value: V | null) => options.find((o) => o.value === value)?.label ?? ''
