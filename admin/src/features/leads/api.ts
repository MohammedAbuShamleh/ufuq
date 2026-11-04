import { api } from '@/lib/http'
import type { Envelope } from '@/lib/types'
import type { Lead, LeadPage, LeadStatus } from './types'

export function fetchLeads(status: LeadStatus | null, page: number) {
  const query = new URLSearchParams({ page: String(page) })
  if (status) query.set('status', status)
  return api<LeadPage>(`/leads?${query}`)
}

export const fetchLead = (id: number) => api<Envelope<Lead>>(`/leads/${id}`).then((r) => r.data)

export const moveLead = (id: number, status: LeadStatus) => api<Envelope<Lead>>(`/leads/${id}/status`, { method: 'PATCH', body: { status } }).then((r) => r.data)
