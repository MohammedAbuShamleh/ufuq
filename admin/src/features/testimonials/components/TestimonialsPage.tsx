import { Badge, PageHeader } from '@/components/Page'
import { EnglishBadge } from '@/components/EnglishBadge'
import { ResourceList } from '@/components/ResourceList'
import { LinkButton } from '@/components/ui/Button'
import { ar } from '@/lib/i18n'
import { testimonials } from '../api'

export function TestimonialsPage() {
  const list = testimonials.useList()
  const reorder = testimonials.useReorder()
  const remove = testimonials.useRemove()

  return (
    <>
      <PageHeader
        title="الشهادات"
        description="أقوال العملاء في الصفحة الرئيسية، وفي صفحة المشروع المرتبط بها. المسودة لا تظهر حتى تُنشر."
        actions={<LinkButton to="/testimonials/new">شهادة جديدة</LinkButton>}
      />
      <ResourceList
        query={list}
        reorder={reorder}
        remove={remove}
        name={(t) => `شهادة ${ar(t.author_name) || ar(t.organization) || 'بلا اسم'}`}
        editTo={(t) => `/testimonials/${t.id}`}
        empty={{ title: 'لا شهادات بعد', action: <LinkButton to="/testimonials/new">أضف أول شهادة</LinkButton> }}
      >
        {(t) => (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm">{ar(t.author_name) || '—'}</span>
              <span className="block truncate text-xs text-muted">
                {[ar(t.organization), t.project && `مشروع: ${ar(t.project.title)}`].filter(Boolean).join(' · ')}
              </span>
            </span>
            <EnglishBadge locales={t.locales} />
            {t.status === 'published' ? <Badge tone="ok">منشورة</Badge> : <Badge>مسودة</Badge>}
          </>
        )}
      </ResourceList>
    </>
  )
}
