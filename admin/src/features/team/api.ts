import { api, upload } from '@/lib/http'
import { blank, tr } from '@/lib/i18n'
import { resource } from '@/lib/resource'
import type { Envelope } from '@/lib/types'
import type { Member, MemberInput } from './types'

export const team = resource<Member, MemberInput>('team')

export const toMemberInput = (m: Member): MemberInput => ({
  name: tr(m.name),
  role: tr(m.role),
  bio: tr(m.bio),
  tech: m.tech ?? '',
  is_founder: m.is_founder,
  is_visible: m.is_visible,
})

export const blankMember = (): MemberInput => ({ name: blank(), role: blank(), bio: blank(), tech: '', is_founder: false, is_visible: true })

export function uploadPhoto(id: number, file: File, onProgress: (f: number) => void) {
  const form = new FormData()
  form.append('photo', file)
  return upload<Envelope<Member>>(`/team/${id}/photo`, form, onProgress).then((r) => r.data)
}

export const removePhoto = (id: number) => api<Envelope<Member>>(`/team/${id}/photo`, { method: 'DELETE' }).then((r) => r.data)
