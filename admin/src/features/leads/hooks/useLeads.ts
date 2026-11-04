import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchLead, fetchLeads, moveLead } from '../api'
import type { LeadStatus } from '../types'

const KEY = ['leads'] as const

export function useLeads(status: LeadStatus | null, page: number) {
  return useQuery({ queryKey: [...KEY, 'list', status, page], queryFn: () => fetchLeads(status, page), placeholderData: keepPreviousData })
}

/** New messages, for the badge in the sidebar. Checked every two minutes. */
export function useNewLeadsCount(): number {
  const { data } = useQuery({ queryKey: [...KEY, 'list', 'new', 1], queryFn: () => fetchLeads('new', 1), refetchInterval: 120_000 })
  return data?.counts.new ?? 0
}

export function useLead(id: number) {
  return useQuery({ queryKey: [...KEY, 'item', id], queryFn: () => fetchLead(id) })
}

export function useMoveLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: LeadStatus }) => moveLead(id, status),
    onSuccess: (lead) => {
      qc.setQueryData([...KEY, 'item', lead.id], lead)
      void qc.invalidateQueries({ queryKey: [...KEY, 'list'] })
    },
  })
}
