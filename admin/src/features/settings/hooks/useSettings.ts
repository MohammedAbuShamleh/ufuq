import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSettings, saveSettings } from '../api'
import type { Settings } from '../types'

export const SETTINGS_KEY = ['settings'] as const

export function useSettings() {
  return useQuery({ queryKey: SETTINGS_KEY, queryFn: fetchSettings })
}

export function useSaveSettings() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: saveSettings, onSuccess: (s) => qc.setQueryData(SETTINGS_KEY, s) })
}

/** Uploads and removals answer with the whole settings form. */
export function useStoreSettings() {
  const qc = useQueryClient()
  return (s: Settings) => qc.setQueryData(SETTINGS_KEY, s)
}
