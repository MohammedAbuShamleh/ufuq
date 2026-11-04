import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { errorMessage } from '@/lib/http'
import { deleteOptions, useConfirm } from './confirm/confirm'
import { EmptyState, ErrorState, Loading } from './Page'
import { SortableList } from './SortableList'
import { DELETED, SAVED, useToast } from './toast/toast'

type Props<T extends { id: number }> = {
  query: UseQueryResult<T[]>
  reorder?: UseMutationResult<void, Error, number[], unknown>
  remove: UseMutationResult<void, Error, number>
  name: (item: T) => string
  editTo: (item: T) => string
  empty: { title: string; body?: string; action?: ReactNode }
  /** Rows removed for good (users), not soft-deleted. */
  permanent?: boolean
  /** Rows that offer no delete button (your own account). */
  removable?: (item: T) => boolean
  /** The row's content: thumbnail, name, details and badges. */
  children: (item: T) => ReactNode
}

/**
 * A section's list: every row opens its form, can be deleted after a
 * confirmation that names it, and — when the section has an order — is
 * dragged into place and saved on drop.
 */
export function ResourceList<T extends { id: number }>({ query, reorder, remove, name, editTo, empty, permanent, removable = () => true, children }: Props<T>) {
  const toast = useToast()
  const confirm = useConfirm()

  if (query.isPending) return <Loading />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  if (query.data.length === 0) return <EmptyState {...empty} />

  const destroy = async (item: T) => {
    if (!(await confirm(deleteOptions(name(item), permanent)))) return
    remove.mutate(item.id, { onSuccess: () => toast.ok(permanent ? 'حُذف.' : DELETED), onError: (e) => toast.error(errorMessage(e)) })
  }

  const row = (item: T, handle?: ReactNode) => (
    <div className="flex items-center gap-2 rounded-card border border-line bg-bg py-2.5 ps-2 pe-3 transition-colors hover:border-muted/50 sm:gap-3">
      {handle ?? <span className="w-2" />}
      <Link to={editTo(item)} className="flex min-w-0 flex-1 items-center gap-3 rounded-field py-1">
        {children(item)}
      </Link>
      {removable(item) ? (
        <button
          type="button"
          onClick={() => void destroy(item)}
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-field text-muted transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <span className="sr-only">حذف «{name(item)}»</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
          </svg>
        </button>
      ) : (
        <span className="size-9 shrink-0" />
      )}
    </div>
  )

  if (!reorder) {
    return (
      <ul className="grid gap-2">
        {query.data.map((item) => (
          <li key={item.id} className="min-w-0">
            {row(item)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <p className="mb-3 text-xs text-muted">يظهر في الموقع بهذا الترتيب. اسحب من المقبض لتغييره، ويُحفظ فور الإفلات.</p>
      <SortableList
        items={query.data}
        name={name}
        className="grid gap-2"
        onReorder={(ids) => reorder.mutate(ids, { onSuccess: () => toast.ok(SAVED), onError: (e) => toast.error(errorMessage(e)) })}
      >
        {(item, handle) => row(item, handle)}
      </SortableList>
    </>
  )
}
