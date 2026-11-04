// Shapes shared by several sections of the admin API (/admin/v1).

/** An uploaded file: original URL plus webp widths (empty when the server made none). */
export type Media = {
  url: string
  mime: string
  width: number | null
  height: number | null
  sizes: { width: number; url: string }[]
}

export type PublishStatus = 'draft' | 'published'

export const PUBLISH_OPTIONS: readonly { value: PublishStatus; label: string }[] = [
  { value: 'draft', label: 'مسودة — لا تظهر في الموقع' },
  { value: 'published', label: 'منشور — يظهر في الموقع' },
]

export type Envelope<T> = { data: T }
