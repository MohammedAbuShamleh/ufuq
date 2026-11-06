import { EnglishBadge } from '@/components/EnglishBadge'
import { MediaThumb } from '@/components/MediaThumb'
import { Badge, PageHeader } from '@/components/Page'
import { ResourceList } from '@/components/ResourceList'
import { LinkButton } from '@/components/ui/Button'
import { ar } from '@/lib/i18n'
import { team } from '../api'

export function TeamPage() {
  const list = team.useList()
  const reorder = team.useReorder()
  const remove = team.useRemove()

  return (
    <>
      <PageHeader title="الفريق" description="بطاقات الفريق في صفحة «من نحن». المؤسسون يظهرون أولاً بحجم أكبر." actions={<LinkButton to="/team/new">عضو جديد</LinkButton>} />
      <ResourceList
        query={list}
        reorder={reorder}
        remove={remove}
        name={(m) => ar(m.name) || 'عضو بلا اسم'}
        editTo={(m) => `/team/${m.id}`}
        empty={{ title: 'لا أعضاء بعد', action: <LinkButton to="/team/new">أضف أول عضو</LinkButton> }}
      >
        {(m) => (
          <>
            <MediaThumb media={m.photo} className="size-10 shrink-0 rounded-full" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm">{ar(m.name) || '—'}</span>
              <span className="block truncate text-xs text-muted">{ar(m.role)}</span>
            </span>
            <EnglishBadge locales={m.locales} />
            {m.is_founder && <Badge tone="accent">مؤسس</Badge>}
            {!m.is_visible && <Badge>مخفي</Badge>}
          </>
        )}
      </ResourceList>
    </>
  )
}
