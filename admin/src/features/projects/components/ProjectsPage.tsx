import { EnglishBadge } from '@/components/EnglishBadge'
import { MediaThumb } from '@/components/MediaThumb'
import { Badge, PageHeader } from '@/components/Page'
import { ResourceList } from '@/components/ResourceList'
import { LinkButton } from '@/components/ui/Button'
import { formatCount } from '@/lib/format'
import { ar } from '@/lib/i18n'
import { projects } from '../api'
import { label, TYPE_OPTIONS } from '../labels'

const SCREENS = { zero: 'بلا شاشات', one: 'شاشة واحدة', two: 'شاشتان', few: 'شاشات', many: 'شاشة' }

export function ProjectsPage() {
  const list = projects.useList()
  const reorder = projects.useReorder()
  const remove = projects.useRemove()

  return (
    <>
      <PageHeader
        title="المشاريع"
        description="أعمال أفق في الموقع. أضف المشروع ونصوصه أولاً، ثم ارفع شاشاته، وراجع بطاقته قبل النشر."
        actions={<LinkButton to="/projects/new">مشروع جديد</LinkButton>}
      />
      <ResourceList
        query={list}
        reorder={reorder}
        remove={remove}
        name={(p) => ar(p.title) || p.slug}
        editTo={(p) => `/projects/${p.id}`}
        empty={{ title: 'لا مشاريع بعد', action: <LinkButton to="/projects/new">أضف أول مشروع</LinkButton> }}
      >
        {(p) => (
          <>
            <MediaThumb media={p.cover?.file} className="hidden h-12 w-18 shrink-0 rounded-field border border-line sm:block" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm">{ar(p.title) || p.slug}</span>
              <span className="block truncate text-xs text-muted">
                {[label(TYPE_OPTIONS, p.type), ar(p.client_name), formatCount(p.screens_count, SCREENS)].filter(Boolean).join(' · ')}
              </span>
            </span>
            <EnglishBadge locales={p.locales} />
            {p.is_featured && <Badge tone="accent">مميز</Badge>}
            {p.status === 'published' ? <Badge tone="ok">منشور</Badge> : <Badge>مسودة</Badge>}
          </>
        )}
      </ResourceList>
    </>
  )
}
