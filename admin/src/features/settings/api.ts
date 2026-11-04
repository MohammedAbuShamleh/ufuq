import { api, upload } from '@/lib/http'
import { LOCALES, tr } from '@/lib/i18n'
import type { Envelope } from '@/lib/types'
import type { PolicyDraft, PolicySection, Settings, SettingsInput } from './types'

export const fetchSettings = () => api<Envelope<Settings>>('/settings').then((r) => r.data)

export const saveSettings = (input: SettingsInput) => api<Envelope<Settings>>('/settings', { method: 'PUT', body: toPayload(input) }).then((r) => r.data)

export function uploadProfilePdf(file: File, onProgress: (f: number) => void) {
  const form = new FormData()
  form.append('file', file)
  return upload<Envelope<Settings>>('/settings/profile-pdf', form, onProgress).then((r) => r.data)
}

export const removeProfilePdf = () => api<Envelope<Settings>>('/settings/profile-pdf', { method: 'DELETE' }).then((r) => r.data)

const toDraft = (sections: PolicySection[] | null | undefined): PolicyDraft[] => (sections ?? []).map((s) => ({ heading: s.heading, body: s.paragraphs.join('\n\n') }))

const toSections = (drafts: PolicyDraft[] = []): PolicySection[] =>
  drafts.map((d) => ({
    heading: d.heading.trim(),
    paragraphs: d.body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  }))

export const toSettingsInput = (s: Settings): SettingsInput => ({
  whatsapp_number: s.whatsapp_number ?? '',
  booking_url: s.booking_url ?? '',
  contact_email: s.contact_email ?? '',
  social_links: { linkedin: s.social_links?.linkedin ?? '', x: s.social_links?.x ?? '', instagram: s.social_links?.instagram ?? '' },
  hero_tagline: tr(s.hero_tagline),
  why_we_started: tr(s.why_we_started),
  legal_registration: tr(s.legal_registration),
  memberships: tr(s.memberships),
  privacy_policy: Object.fromEntries(LOCALES.map((l) => [l.code, toDraft(s.privacy_policy?.[l.code])])),
  privacy_is_draft: s.privacy_is_draft ?? true,
})

/** Empty fields go as null: the site shows them as pending, not as blank text. */
function toPayload(input: SettingsInput) {
  const orNull = (v: string) => v.trim() || null
  return {
    ...input,
    whatsapp_number: orNull(input.whatsapp_number),
    booking_url: orNull(input.booking_url),
    contact_email: orNull(input.contact_email),
    social_links: { linkedin: orNull(input.social_links.linkedin), x: orNull(input.social_links.x), instagram: orNull(input.social_links.instagram) },
    privacy_policy: Object.fromEntries(Object.entries(input.privacy_policy).map(([locale, drafts]) => [locale, toSections(drafts)])),
  }
}
