import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './http'
import type { Envelope } from './types'

type Identified = { id: number }

/**
 * Query hooks for one admin resource with the standard routes: index, store,
 * show, update, destroy and reorder. Team, clients, FAQs, testimonials,
 * projects and users all share this shape, so they share these hooks.
 */
export function resource<Item extends Identified, Input, Row extends Identified = Item>(path: string) {
  const keys = {
    all: [path] as const,
    list: [path, 'list'] as const,
    item: (id: number) => [path, 'item', id] as const,
  }

  const list = () => api<Envelope<Row[]>>(`/${path}`).then((r) => r.data)
  const show = (id: number) => api<Envelope<Item>>(`/${path}/${id}`).then((r) => r.data)
  const save = ({ id, input }: { id: number | null; input: Input }) =>
    api<Envelope<Item>>(id === null ? `/${path}` : `/${path}/${id}`, { method: id === null ? 'POST' : 'PUT', body: input }).then((r) => r.data)

  function useList() {
    return useQuery({ queryKey: keys.list, queryFn: list })
  }

  function useItem(id: number | null) {
    return useQuery({ queryKey: keys.item(id ?? 0), queryFn: () => show(id!), enabled: id !== null })
  }

  function useSave() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: save,
      onSuccess: (item) => {
        qc.setQueryData(keys.item(item.id), item)
        void qc.invalidateQueries({ queryKey: keys.list })
      },
    })
  }

  function useRemove() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: number) => api<void>(`/${path}/${id}`, { method: 'DELETE' }),
      onSuccess: (_, id) => {
        qc.removeQueries({ queryKey: keys.item(id) })
        void qc.invalidateQueries({ queryKey: keys.list })
      },
    })
  }

  /** Moves rows at once on drop, then saves; a failed save puts them back. */
  function useReorder() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (ids: number[]) => api<void>(`/${path}/reorder`, { method: 'POST', body: { ids } }),
      onMutate: async (ids) => {
        await qc.cancelQueries({ queryKey: keys.list })
        const previous = qc.getQueryData<Row[]>(keys.list)
        if (previous) {
          const byId = new Map(previous.map((r) => [r.id, r]))
          qc.setQueryData<Row[]>(keys.list, ids.flatMap((id) => byId.get(id) ?? []))
        }
        return { previous }
      },
      onError: (_error, _ids, context) => {
        if (context?.previous) qc.setQueryData(keys.list, context.previous)
      },
      onSettled: () => qc.invalidateQueries({ queryKey: keys.list }),
    })
  }

  return { path, keys, useList, useItem, useSave, useRemove, useReorder }
}
