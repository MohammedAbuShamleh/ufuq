import { MediaThumb } from '@/components/MediaThumb'
import { TranslatedInline } from '@/components/TranslatedInline'
import { ProgressBar } from '@/components/upload/FileDrop'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { formatNumber } from '@/lib/format'
import type { T } from '@/lib/i18n'
import { KIND_OPTIONS } from '../../labels'
import { KIND_HINT } from '../../screens'
import type { ScreenKind } from '../../types'

/** A file picked for upload, with the details the team fills in before sending it. */
export type Pending = {
  uid: string
  file: File
  url: string
  kind: ScreenKind
  alt: T
  label: T
  progress: number | null
  error: string | null
}

type Props = { item: Pending; onChange: (patch: Partial<Pending>) => void; onSend: () => void; onDrop: () => void }

export function QueueItem({ item, onChange, onSend, onDrop }: Props) {
  const busy = item.progress !== null
  const kinds = item.file.type.startsWith('video/') ? KIND_OPTIONS.filter((k) => k.value === 'video') : KIND_OPTIONS.filter((k) => k.value !== 'video')

  return (
    <li className="grid gap-4 rounded-card border border-line bg-bg p-4 sm:grid-cols-[9rem_1fr]">
      <MediaThumb src={item.url} mime={item.file.type} alt="" className={`w-full rounded-field border border-line ${item.kind === 'mobile' ? 'mx-auto aspect-[9/16] max-w-24' : 'aspect-[16/10]'}`} />
      <fieldset disabled={busy} className="grid min-w-0 gap-4">
        <legend className="sr-only">تفاصيل {item.file.name}</legend>
        <p className="truncate text-xs text-muted" dir="ltr">
          {item.file.name}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="النوع" value={item.kind} options={kinds} onChange={(kind) => onChange({ kind })} hint={KIND_HINT[item.kind]} />
          <TranslatedInline label="التسمية" max={60} placeholder="لوحة التحكم" hint="كلمة أو كلمتان تحت الشاشة أو على زرّها في الموقع. اختياري." value={item.label} onChange={(label) => onChange({ label })} />
        </div>
        <TranslatedInline
          label="وصف الصورة (نص بديل)"
          required
          max={160}
          hint="جملة تصف ما في الشاشة لمن لا يراها: «لوحة متابعة الطلاب وتقارير الحضور»."
          value={item.alt}
          onChange={(alt) => onChange({ alt, error: null })}
        />
        {busy && <ProgressBar value={item.progress ?? 0} label={`رفع ${item.file.name}`} />}
        {item.error && (
          <p role="alert" className="text-sm text-danger">
            {item.error}
          </p>
        )}
        <div className="flex gap-2">
          <Button size="sm" busy={busy} onClick={onSend}>
            {busy ? `جارٍ الرفع ${formatNumber(Math.round((item.progress ?? 0) * 100))}٪` : 'رفع'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDrop}>
            إزالة من القائمة
          </Button>
        </div>
      </fieldset>
    </li>
  )
}
