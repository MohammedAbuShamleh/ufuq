import type { Locale, T } from '@/lib/i18n'
import type { PublishStatus } from '@/lib/types'

export type Testimonial = {
  id: number
  /** The languages the site shows it in. */
  locales: Locale[]
  project_id: number | null
  project: { id: number; title: T } | null
  quote: T
  author_name: T
  author_title: T
  organization: T
  status: PublishStatus
  sort_order: number
}

export type TestimonialInput = { project_id: number | null; quote: T; author_name: T; author_title: T; organization: T; status: PublishStatus }
