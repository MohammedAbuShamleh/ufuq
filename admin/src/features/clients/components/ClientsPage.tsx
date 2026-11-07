import { EnglishBadge } from '@/components/EnglishBadge'
import { MediaThumb } from '@/components/MediaThumb'
import { Badge, PageHeader } from '@/components/Page'
import { ResourceList } from '@/components/ResourceList'
import { LinkButton } from '@/components/ui/Button'
import { ar } from '@/lib/i18n'
import { clients } from '../api'

export function ClientsPage() {
  const list = clients.useList()
  const reorder = clients.useReorder()
  const remove = clients.useRemove()

  return (
    <>
      <PageHeader title="العملاء" description="جدار «جهات وثقت بنا» في الصفحة الرئيسية. لا يُضاف عميل قبل إذنه بذكر اسمه." actions={<LinkButton to="/clients/new">عميل جديد</LinkButton>} />
      <ResourceList
        query={list}
        reorder={reorder}
        remove={remove}
        name={(c) => ar(c.name) || 'عميل بلا اسم'}
        editTo={(c) => `/clients/${c.id}`}
        empty={{ title: 'لا عملاء بعد', action: <LinkButton to="/clients/new">أضف أول عميل</LinkButton> }}
      >
        {(c) => (
          <>
            <MediaThumb media={c.logo} fit="contain" className="h-10 w-16 shrink-0 rounded-field p-1" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm">{ar(c.name) || '—'}</span>
              <span className="block truncate text-xs text-muted">
                {[ar(c.sector_label), ar(c.location)].filter(Boolean).join(' · ')}
              </span>
            </span>
            <EnglishBadge locales={c.locales} />
            {!c.is_visible && <Badge>مخفي</Badge>}
          </>
        )}
      </ResourceList>
    </>
  )
}
