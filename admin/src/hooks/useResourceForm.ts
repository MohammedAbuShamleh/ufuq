import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { deleteOptions, useConfirm } from '@/components/confirm/confirm'
import { SAVED, useToast } from '@/components/toast/toast'
import { errorMessage, fieldErrors } from '@/lib/http'
import { useUnsavedGuard } from './useUnsavedGuard'

type Hooks<Item, Input> = {
  path: string
  useItem: (id: number | null) => UseQueryResult<Item>
  useSave: () => UseMutationResult<Item, Error, { id: number | null; input: Input }>
  useRemove: () => UseMutationResult<void, Error, number>
}

/**
 * The add/edit form of one record. Edits live in a draft until saved; the
 * saved record (from the query cache) is shown otherwise, so there is no copy
 * to keep in sync. A new record moves to its own URL once created.
 */
export function useResourceForm<Item extends { id: number }, Input>(
  res: Hooks<Item, Input>,
  id: number | null,
  toInput: (item: Item) => Input,
  blank: () => Input,
  options: {
    /** Where a newly created record opens (default: its own form). */
    createdPath?: (id: number) => string
    /** Records the public site never shows (users): no «the site updates» promise. */
    offSite?: boolean
  } = {},
) {
  const { createdPath = (newId: number) => `/${res.path}/${newId}`, offSite = false } = options
  const item = res.useItem(id)
  const save = res.useSave()
  const remove = res.useRemove()
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Input | null>(null)
  const guard = useUnsavedGuard(draft !== null)

  const loaded = id === null ? blank() : item.data ? toInput(item.data) : null
  const values = draft ?? loaded

  const set = <K extends keyof Input>(key: K, value: Input[K]) => setDraft((prev) => ({ ...(prev ?? loaded!), [key]: value }))

  /** onInvalid gets the fields the server refused, so a tabbed form can open the right tab. */
  const submit = (onInvalid?: (fields: string[]) => void) => {
    if (!values) return
    save.mutate(
      { id, input: values },
      {
        onSuccess: (saved) => {
          setDraft(null)
          toast.ok(offSite ? 'حُفظ.' : SAVED)
          if (id === null) {
            guard.release()
            navigate(createdPath(saved.id), { replace: true })
          }
        },
        onError: (error) => {
          toast.error(errorMessage(error))
          const fields = Object.keys(fieldErrors(error))
          if (fields.length) onInvalid?.(fields)
        },
      },
    )
  }

  const destroy = async (name: string, permanent = false) => {
    if (id === null || !(await confirm(deleteOptions(name, permanent)))) return
    remove.mutate(id, {
      onSuccess: () => {
        guard.release()
        toast.ok(permanent || offSite ? 'حُذف.' : 'حُذف، وسيختفي من الموقع خلال ثوانٍ.')
        navigate(`/${res.path}`)
      },
      onError: (error) => toast.error(errorMessage(error)),
    })
  }

  return {
    item,
    values,
    set,
    errors: fieldErrors(save.error),
    submit,
    saving: save.isPending,
    destroy,
    removing: remove.isPending,
    dirty: draft !== null,
    discard: () => setDraft(null),
  }
}
