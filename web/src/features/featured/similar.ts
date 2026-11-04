import type { ProjectType } from '@/lib/types'

/** «I want something like this»: the link text and the project type it picks in the contact form. */
export const SIMILAR: Record<ProjectType, { label: string; formType: string }> = {
  platform: { label: 'أريد منصة مشابهة', formType: 'منصة إلكترونية' },
  app: { label: 'أريد تطبيقاً مشابهاً', formType: 'تطبيق جوال' },
  website: { label: 'أريد موقعاً مشابهاً', formType: 'موقع إبداعي' },
  system: { label: 'أريد نظاماً مشابهاً', formType: 'نظام ERP' },
}

/** From another page: the home contact form, with the project type picked through ?type=. */
export const similarHref = (type: ProjectType) => `/?type=${encodeURIComponent(SIMILAR[type].formType)}#contact`
