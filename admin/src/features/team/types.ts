import type { T } from '@/lib/i18n'
import type { Media } from '@/lib/types'

export type Member = {
  id: number
  name: T
  role: T
  bio: T | null
  tech: string | null
  is_founder: boolean
  is_visible: boolean
  sort_order: number
  photo: Media | null
}

export type MemberInput = { name: T; role: T; bio: T; tech: string; is_founder: boolean; is_visible: boolean }
