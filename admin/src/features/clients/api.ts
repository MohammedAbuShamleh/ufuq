import { api, upload } from '@/lib/http'
import { blank, tr } from '@/lib/i18n'
import { resource } from '@/lib/resource'
import type { Envelope } from '@/lib/types'
import type { Client, ClientInput } from './types'

export const clients = resource<Client, ClientInput>('clients')

export const toClientInput = (c: Client): ClientInput => ({ name: tr(c.name), sector_label: tr(c.sector_label), location: tr(c.location), is_visible: c.is_visible })

export const blankClient = (): ClientInput => ({ name: blank(), sector_label: blank(), location: blank(), is_visible: true })

export function uploadLogo(id: number, file: File, onProgress: (f: number) => void) {
  const form = new FormData()
  form.append('logo', file)
  return upload<Envelope<Client>>(`/clients/${id}/logo`, form, onProgress).then((r) => r.data)
}

export const removeLogo = (id: number) => api<Envelope<Client>>(`/clients/${id}/logo`, { method: 'DELETE' }).then((r) => r.data)
