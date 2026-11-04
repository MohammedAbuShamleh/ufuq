import { useQueryClient } from '@tanstack/react-query'

type Keys = { list: readonly unknown[]; item: (id: number) => readonly unknown[] }

/**
 * After an upload or removal the API answers with the whole updated record:
 * put it in the cache so the form shows it, and refresh the section's list.
 */
export function useStoreRecord<T extends { id: number }>(keys: Keys) {
  const qc = useQueryClient()
  return (record: T) => {
    qc.setQueryData(keys.item(record.id), record)
    void qc.invalidateQueries({ queryKey: keys.list })
  }
}
