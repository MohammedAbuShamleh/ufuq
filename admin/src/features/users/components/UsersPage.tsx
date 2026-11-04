import { Badge, PageHeader } from '@/components/Page'
import { ResourceList } from '@/components/ResourceList'
import { LinkButton } from '@/components/ui/Button'
import { useUser } from '@/features/auth/hooks/useAuth'
import { ROLE_LABEL } from '@/features/auth/types'
import { users } from '../api'

export function UsersPage() {
  const me = useUser()
  const list = users.useList()
  const remove = users.useRemove()

  return (
    <>
      <PageHeader title="المستخدمون" description="من يدخل هذه اللوحة. المحرّر يدير المحتوى والرسائل، والمدير يدير كل شيء." actions={<LinkButton to="/users/new">مستخدم جديد</LinkButton>} />
      <ResourceList
        query={list}
        remove={remove}
        permanent
        removable={(u) => u.id !== me.id}
        name={(u) => u.name}
        editTo={(u) => `/users/${u.id}`}
        empty={{ title: 'لا مستخدمين' }}
      >
        {(u) => (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm">
                {u.name}
                {u.id === me.id && <span className="text-muted"> (أنت)</span>}
              </span>
              <span className="block truncate text-xs text-muted" dir="ltr">
                {u.email}
              </span>
            </span>
            <Badge tone={u.role === 'admin' ? 'accent' : 'muted'}>{ROLE_LABEL[u.role]}</Badge>
          </>
        )}
      </ResourceList>
    </>
  )
}
