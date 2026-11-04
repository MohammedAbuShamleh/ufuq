import type { Locale, T } from '@/lib/i18n'
import type { Media } from '@/lib/types'

export type PolicySection = { heading: string; paragraphs: string[] }

export type SocialLinks = { linkedin: string | null; x: string | null; instagram: string | null }

export type Settings = {
  whatsapp_number: string | null
  booking_url: string | null
  contact_email: string | null
  social_links: SocialLinks | null
  profile_pdf: Media | null
  hero_tagline: T | null
  why_we_started: T | null
  legal_registration: T | null
  memberships: T | null
  privacy_policy: Partial<Record<Locale, PolicySection[] | null>> | null
  privacy_is_draft: boolean | null
}

/** A policy section while editing: paragraphs are one text, split on blank lines when saved. */
export type PolicyDraft = { heading: string; body: string }

export type SettingsInput = {
  whatsapp_number: string
  booking_url: string
  contact_email: string
  social_links: { linkedin: string; x: string; instagram: string }
  hero_tagline: T
  why_we_started: T
  legal_registration: T
  memberships: T
  privacy_policy: Partial<Record<Locale, PolicyDraft[]>>
  privacy_is_draft: boolean
}
