export type LeadStatus = 'new' | 'contacted' | 'closed'

export type Lead = {
  id: number
  name: string
  contact: string
  project_type: string | null
  message: string | null
  source_page: string | null
  /** The site version it was sent from: answer in that language. */
  locale: 'ar' | 'en'
  status: LeadStatus
  next_status: Exclude<LeadStatus, 'new'> | null
  created_at: string
  whatsapp_url: string | null
}

export type LeadPage = {
  data: Lead[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
  counts: Record<LeadStatus, number>
}

export const STATUS_LABEL: Record<LeadStatus, string> = { new: 'جديدة', contacted: 'تواصلنا', closed: 'مغلقة' }

/** The button that moves a message on, named by what the team just did. */
export const NEXT_ACTION: Record<Exclude<LeadStatus, 'new'>, string> = {
  contacted: 'تواصلنا معه',
  closed: 'إغلاق الرسالة',
}

export const STATUS_TONE = { new: 'accent', contacted: 'ok', closed: 'muted' } as const
