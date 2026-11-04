import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { ErrorState, Loading } from '@/components/Page'
import { UserContext, useCan, useMe } from '../hooks/useAuth'

/** The signed-in area: anyone without a session goes to the login screen. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const me = useMe()
  const location = useLocation()

  if (me.isPending) return <Loading />
  if (me.isError) {
    return (
      <div className="wrap py-20">
        <ErrorState error={me.error} onRetry={() => void me.refetch()} />
      </div>
    )
  }
  if (!me.data) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />

  return <UserContext value={me.data}>{children}</UserContext>
}

/** Settings and users: admins only. Editors get a plain explanation, not a broken screen. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const can = useCan()
  if (can.settings) return children

  return (
    <div className="rounded-card border border-line bg-surface px-6 py-14 text-center">
      <p className="font-display">هذا القسم لمدير اللوحة فقط</p>
      <p className="mt-1 text-sm text-muted">صلاحيتك «محرّر»: تدير المحتوى ورسائل التواصل، أما الإعدادات والمستخدمون فللمدير.</p>
    </div>
  )
}
