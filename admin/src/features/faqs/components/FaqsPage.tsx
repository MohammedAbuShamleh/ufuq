import { Badge, PageHeader } from '@/components/Page'
import { ResourceList } from '@/components/ResourceList'
import { LinkButton } from '@/components/ui/Button'
import { ar } from '@/lib/i18n'
import { faqs } from '../api'

export function FaqsPage() {
  const list = faqs.useList()
  const reorder = faqs.useReorder()
  const remove = faqs.useRemove()

  return (
    <>
      <PageHeader title="الأسئلة الشائعة" description="تظهر في الصفحة الرئيسية قبل نموذج التواصل." actions={<LinkButton to="/faqs/new">سؤال جديد</LinkButton>} />
      <ResourceList
        query={list}
        reorder={reorder}
        remove={remove}
        name={(f) => ar(f.question) || 'سؤال بلا نص'}
        editTo={(f) => `/faqs/${f.id}`}
        empty={{ title: 'لا أسئلة بعد', action: <LinkButton to="/faqs/new">أضف أول سؤال</LinkButton> }}
      >
        {(f) => (
          <>
            <span className="min-w-0 flex-1 truncate font-display text-sm">{ar(f.question) || '—'}</span>
            {!f.is_visible && <Badge>مخفي</Badge>}
          </>
        )}
      </ResourceList>
    </>
  )
}
