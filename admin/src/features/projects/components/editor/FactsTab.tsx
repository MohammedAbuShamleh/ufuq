import { Panel } from '@/components/Page'
import { TranslatedInline } from '@/components/TranslatedInline'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { formatNumber } from '@/lib/format'
import { blank } from '@/lib/i18n'
import type { TabProps } from './tabProps'

const MAX_FEATURED_FACTS = 2
const MAX_FACTS = 3
const MAX_HIGHLIGHTS = 6

/** The figures beside a featured project's title, the points beside its screens, and the older figures. */
export function FactsTab({ values, set, errors }: TabProps) {
  const { featured_facts: featured, facts, highlights } = values

  return (
    <div className="grid gap-6">
      <Panel title="أرقام بارزة" description="حتى رقمين يظهران بجانب العنوان في طريقة العرض «واجهة وشاشات»، مثل «١٤ حالة لكل مشروع».">
        {featured.map((fact, i) => (
          <div key={i} className="grid items-start gap-3 rounded-field border border-line p-3 sm:grid-cols-[9rem_1fr_auto]">
            <TextField label="الرقم" required max={32} placeholder="١٤" value={fact.value} onChange={(v) => set('featured_facts', featured.map((f, j) => (j === i ? { ...f, value: v } : f)))} error={errors[`featured_facts.${i}.value`]} />
            <TranslatedInline label="وصف الرقم" required max={60} placeholder="حالة لكل مشروع" value={fact.label} onChange={(label) => set('featured_facts', featured.map((f, j) => (j === i ? { ...f, label } : f)))} errorFor={(l) => errors[`featured_facts.${i}.label.${l}`]} />
            <Button variant="ghost" size="sm" className="sm:mt-7" onClick={() => set('featured_facts', featured.filter((_, j) => j !== i))}>
              إزالة
            </Button>
          </div>
        ))}
        {errors.featured_facts && (
          <p role="alert" className="text-sm text-danger">
            {errors.featured_facts}
          </p>
        )}
        {featured.length < MAX_FEATURED_FACTS && (
          <div>
            <Button variant="secondary" size="sm" onClick={() => set('featured_facts', [...featured, { value: '', label: blank() }])}>
              إضافة رقم بارز
            </Button>
          </div>
        )}
      </Panel>

      <Panel title="أرقام أخرى" description={`حتى ${formatNumber(MAX_FACTS)} أرقام، مثل «+٤٠٠٠ مستفيد». محفوظة مع المشروع، ولا تظهر في الموقع حالياً.`}>
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

      <Panel title="النقاط" description={`حتى ${formatNumber(MAX_HIGHLIGHTS)} نقاط قصيرة: ما الذي يميّز هذا النظام. تظهر بجانب النص في طريقة العرض «لوحة شاشات».`}>
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
