import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import { useConfirm } from '@/components/confirm/confirm'
import { Badge, ErrorState, Loading, PageHeader, Panel } from '@/components/Page'
import { useToast } from '@/components/toast/toast'
import { Button } from '@/components/ui/Button'
import { buttonClass } from '@/components/ui/buttonClass'
import { formatDateTime } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useLead, useMoveLead } from '../hooks/useLeads'
import { NEXT_ACTION, STATUS_LABEL, STATUS_TONE, type Lead } from '../types'

const isEmail = (contact: string) => contact.includes('@')

export function LeadDetail() {
  const id = Number(useParams().id)
  const lead = useLead(id)

  return (
    <>
      <PageHeader title={lead.data?.name ?? 'رسالة'} back={{ to: '/leads', label: 'رسائل التواصل' }} actions={lead.data && <Badge tone={STATUS_TONE[lead.data.status]}>{STATUS_LABEL[lead.data.status]}</Badge>} />
      {lead.isPending ? <Loading /> : lead.isError ? <ErrorState error={lead.error} onRetry={() => void lead.refetch()} /> : <LeadBody lead={lead.data} />}
    </>
  )
}

function LeadBody({ lead }: { lead: Lead }) {
  const move = useMoveLead()
  const toast = useToast()
  const confirm = useConfirm()

  const advance = async () => {
    if (!lead.next_status) return
    if (lead.next_status === 'closed' && !(await confirm({ title: 'إغلاق الرسالة؟', body: 'تنتقل إلى «مغلقة» ولا ترجع إلى ما قبلها.', confirmLabel: 'أغلقها' }))) return
    move.mutate({ id: lead.id, status: lead.next_status }, { onSuccess: (l) => toast.ok(`نُقلت الرسالة إلى «${STATUS_LABEL[l.status]}».`), onError: (e) => toast.error(errorMessage(e)) })
  }

  return (
    <div className="grid gap-6">
      <Panel>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Item label="وسيلة التواصل">
            <span dir="ltr">{lead.contact}</span>
          </Item>
          <Item label="نوع المشروع">{lead.project_type ?? '—'}</Item>
          <Item label="وصلت في">{formatDateTime(lead.created_at)}</Item>
          <Item label="من صفحة">
            <span dir="ltr" className="break-all">
              {lead.source_page ?? '—'}
            </span>
          </Item>
        </dl>
        <div>
          <p className="mb-1.5 font-display text-sm text-muted">الرسالة</p>
          <p className="rounded-field bg-surface px-4 py-3 leading-loose whitespace-pre-line">{lead.message || 'لم يكتب رسالة.'}</p>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        {lead.whatsapp_url && (
          <a href={lead.whatsapp_url} target="_blank" rel="noopener" className={buttonClass('primary')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z" />
            </svg>
            مراسلة عبر واتساب
            <span className="sr-only"> (تفتح في نافذة جديدة)</span>
          </a>
        )}
        {isEmail(lead.contact) && (
          <a href={`mailto:${lead.contact}`} className={buttonClass(lead.whatsapp_url ? 'secondary' : 'primary')}>
            مراسلة بالبريد
          </a>
        )}
        {lead.next_status && (
          <Button variant="secondary" busy={move.isPending} onClick={advance}>
            {NEXT_ACTION[lead.next_status]}
          </Button>
        )}
      </div>
    </div>
  )
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-display text-sm text-muted">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  )
}
