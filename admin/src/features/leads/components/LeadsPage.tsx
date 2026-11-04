import { Link, useSearchParams } from 'react-router'
import { Badge, EmptyState, ErrorState, Loading, PageHeader } from '@/components/Page'
import { Button } from '@/components/ui/Button'
import { formatDateTime, formatNumber } from '@/lib/format'
import { useLeads } from '../hooks/useLeads'
import { STATUS_LABEL, STATUS_TONE, type LeadStatus } from '../types'

const FILTERS: { status: LeadStatus | null; label: string }[] = [
  { status: 'new', label: STATUS_LABEL.new },
  { status: 'contacted', label: STATUS_LABEL.contacted },
  { status: 'closed', label: STATUS_LABEL.closed },
  { status: null, label: 'الكل' },
]

export function LeadsPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('status')
  const status: LeadStatus | null = raw === 'all' ? null : raw === 'contacted' || raw === 'closed' ? raw : 'new'
  const page = Math.max(1, Number(params.get('page')) || 1)
  const leads = useLeads(status, page)

  const go = (next: { status?: LeadStatus | null; page?: number }) => {
    const s = next.status === undefined ? status : next.status
    setParams({ status: s ?? 'all', page: String(next.page ?? 1) })
  }

  return (
    <>
      <PageHeader title="رسائل التواصل" description="ما يرسله الزوّار من نموذج «ابدأ مشروعك». حرّك كل رسالة إلى «تواصلنا» حين تردّون، ثم أغلقها." />

      <div role="tablist" aria-label="حالة الرسائل" className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.status === status
          const count = f.status ? leads.data?.counts[f.status] : undefined
          return (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => go({ status: f.status })}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-pill border px-4 py-1.5 font-display text-sm transition-colors ${
                active ? 'border-text bg-text text-bg' : 'border-line bg-bg text-muted hover:text-text'
              }`}
            >
              {f.label}
              {count !== undefined && <span className="text-xs opacity-75">{formatNumber(count)}</span>}
            </button>
          )
        })}
      </div>

      {leads.isPending ? (
        <Loading />
      ) : leads.isError ? (
        <ErrorState error={leads.error} onRetry={() => void leads.refetch()} />
      ) : leads.data.data.length === 0 ? (
        <EmptyState title={status === 'new' ? 'لا رسائل جديدة' : 'لا رسائل هنا'} body={status === 'new' ? 'كل رسالة يرسلها زائر من الموقع تظهر هنا أولاً.' : undefined} />
      ) : (
        <>
          <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-bg">
            {leads.data.data.map((lead) => (
              <li key={lead.id}>
                <Link to={`/leads/${lead.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-surface">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-sm text-muted">
                      <span dir="ltr">{lead.contact}</span>
                      {lead.project_type && <> · {lead.project_type}</>}
                    </p>
                  </div>
                  <span className="text-xs text-muted">{formatDateTime(lead.created_at)}</span>
                  <Badge tone={STATUS_TONE[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
          {leads.data.meta.last_page > 1 && (
            <nav aria-label="صفحات الرسائل" className="mt-5 flex items-center justify-between gap-3">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => go({ page: page - 1 })}>
                الأحدث
              </Button>
              <span className="text-sm text-muted">
                صفحة {formatNumber(page)} من {formatNumber(leads.data.meta.last_page)}
              </span>
              <Button variant="secondary" size="sm" disabled={page >= leads.data.meta.last_page} onClick={() => go({ page: page + 1 })}>
                الأقدم
              </Button>
            </nav>
          )}
        </>
      )}
    </>
  )
}
