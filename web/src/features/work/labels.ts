import type { ProjectSector, ProjectType } from '@/lib/types'

/** Filter names: plural, as the visitor reads a shelf of work. */
export const TYPE_FILTERS: { type: ProjectType; label: string }[] = [
  { type: 'system', label: 'أنظمة' },
  { type: 'website', label: 'مواقع' },
  { type: 'platform', label: 'منصات' },
  { type: 'app', label: 'تطبيقات' },
]

export const SECTOR_FILTERS: { sector: ProjectSector; label: string }[] = [
  { sector: 'charity', label: 'جمعيات خيرية' },
  { sector: 'education', label: 'مدارس وتعليم' },
  { sector: 'government', label: 'جهات حكومية' },
  { sector: 'dawah', label: 'دعوة وتحفيظ' },
  { sector: 'business', label: 'شركات' },
]

/** One project's kind, singular. */
export const TYPE_LABEL: Record<ProjectType, string> = { system: 'نظام', website: 'موقع', platform: 'منصة', app: 'تطبيق جوال' }

export const SECTOR_LABEL = Object.fromEntries(SECTOR_FILTERS.map((s) => [s.sector, s.label])) as Record<ProjectSector, string>

/** The four countries the work runs in today; any other code shows as is. */
const COUNTRIES: Record<string, string> = { PS: 'فلسطين', EG: 'مصر', AE: 'الإمارات', TR: 'تركيا' }

export const countryName = (code: string | null) => (code ? (COUNTRIES[code] ?? code) : null)
