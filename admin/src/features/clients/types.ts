import type { T } from '@/lib/i18n'
import type { Media } from '@/lib/types'

export type Client = { id: number; name: T; sector_label: T; location: T; is_visible: boolean; sort_order: number; logo: Media | null }

export type ClientInput = { name: T; sector_label: T; location: T; is_visible: boolean }
