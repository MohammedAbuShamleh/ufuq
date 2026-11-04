import type { T } from '@/lib/i18n'
import type { Media, PublishStatus } from '@/lib/types'

export type ProjectType = 'system' | 'website' | 'platform' | 'app'
export type ProjectSector = 'charity' | 'education' | 'government' | 'dawah' | 'business'
export type CardTheme = 'linen' | 'ink' | 'sand' | 'charcoal'
export type ScreenKind = 'desktop' | 'mobile' | 'video'

export type Screen = { id: number; kind: ScreenKind; tab_key: string | null; tab_label: T; alt: T; sort_order: number; file: Media | null }

export type Fact = { id?: number; value: string; label: T }
export type Highlight = { id?: number; text: T }

export type ProjectRow = {
  id: number
  slug: string
  title: T
  client_name: T
  tag: T
  type: ProjectType
  sector: ProjectSector
  status: PublishStatus
  is_featured: boolean
  featured_order: number
  sort_order: number
  cover: Screen | null
  screens_count: number
  updated_at: string
}

type Fields = {
  slug: string
  title: T
  client_name: T
  summary: T
  tag: T
  frame_label: T
  challenge: T
  solution: T
  results: T
  type: ProjectType
  sector: ProjectSector
  country: string
  tech_stack: string[]
  is_featured: boolean
  featured_order: number
  card_theme: CardTheme | null
  has_demo_data: boolean
  status: PublishStatus
  facts: Fact[]
  highlights: Highlight[]
}

export type Project = Fields & { id: number; published_at: string | null; sort_order: number; screens: Screen[] }

/** What the form sends: the whole project, facts and highlights included. */
export type ProjectInput = Fields

export type ScreenInput = { kind: ScreenKind; tab_key: string | null; tab_label: T; alt: T }
