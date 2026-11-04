import { Panel } from '@/components/Page'
import { TranslatedInline } from '@/components/TranslatedInline'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { formatNumber } from '@/lib/format'
import { blank } from '@/lib/i18n'
import type { TabProps } from './tabProps'

const MAX_FACTS = 3
const MAX_HIGHLIGHTS = 6

/** The figures under a featured card and the points beside its screens. */
export function FactsTab({ values, set, errors }: TabProps) {
  const { facts, highlights } = values

  return (
    <div className="grid gap-6">
      <Panel title="الأرقام" description={`حتى ${formatNumber(MAX_FACTS)} أرقام تظهر تحت البطاقة المميزة، مثل «+٤٠٠٠ مستفيد».`}>
        {facts.map((fact, i) => (
          <div key={fact.id ?? `new-${i}`} className="grid items-start gap-3 rounded-field border border-line p-3 sm:grid-cols-[9rem_1fr_auto]">
            <TextField label="الرقم" required max={32} placeholder="+٤٠٠٠" value={fact.value} onChange={(v) => set('facts', facts.map((f, j) => (j === i ? { ...f, value: v } : f)))} error={errors[`facts.${i}.value`]} />
            <TranslatedInline label="وصف الرقم" required max={60} placeholder="مستفيد مسجّل" value={fact.label} onChange={(label) => set('facts', facts.map((f, j) => (j === i ? { ...f, label } : f)))} errorFor={(l) => errors[`facts.${i}.label.${l}`]} />
            <Button variant="ghost" size="sm" className="sm:mt-7" onClick={() => set('facts', facts.filter((_, j) => j !== i))}>
              إزالة
            </Button>
          </div>
        ))}
        {facts.length < MAX_FACTS && (
          <div>
            <Button variant="secondary" size="sm" onClick={() => set('facts', [...facts, { value: '', label: blank() }])}>
              إضافة رقم
            </Button>
          </div>
        )}
      </Panel>

      <Panel title="النقاط" description={`حتى ${formatNumber(MAX_HIGHLIGHTS)} نقاط قصيرة: ما الذي يميّز هذا النظام.`}>
        {highlights.map((h, i) => (
          <div key={h.id ?? `new-${i}`} className="grid items-start gap-3 sm:grid-cols-[1fr_auto]">
            <TranslatedInline label={`نص النقطة ${formatNumber(i + 1)}`} required max={200} value={h.text} onChange={(text) => set('highlights', highlights.map((x, j) => (j === i ? { ...x, text } : x)))} errorFor={(l) => errors[`highlights.${i}.text.${l}`]} />
            <Button variant="ghost" size="sm" className="sm:mt-7" onClick={() => set('highlights', highlights.filter((_, j) => j !== i))}>
              إزالة
            </Button>
          </div>
        ))}
        {highlights.length < MAX_HIGHLIGHTS && (
          <div>
            <Button variant="secondary" size="sm" onClick={() => set('highlights', [...highlights, { text: blank() }])}>
              إضافة نقطة
            </Button>
          </div>
        )}
      </Panel>
      <p className="text-xs text-muted">تُحفظ الأرقام والنقاط مع المشروع عند الضغط على «حفظ» أسفل الصفحة.</p>
    </div>
  )
}
