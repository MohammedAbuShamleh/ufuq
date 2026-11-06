import { Panel } from '@/components/Page'
import { Translated } from '@/components/Translated'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { PUBLISH_OPTIONS } from '@/lib/types'
import { COUNTRY_OPTIONS, LAYOUT_HINT, LAYOUT_OPTIONS, SECTOR_OPTIONS, TYPE_OPTIONS } from '../../labels'
import { TagsInput } from '../TagsInput'
import type { TabProps } from './tabProps'

export function BasicsTab({ values, set, errors }: TabProps) {
  return (
    <div className="grid gap-6">
      <Translated errors={errors} fields={['title', 'client_name', 'tag', 'summary']}>
        {(l) => (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="اسم المشروع" required max={120} placeholder="نظام راشد" value={values.title[l] ?? ''} onChange={(v) => set('title', { ...values.title, [l]: v })} error={errors[`title.${l}`]} />
              <TextField label="اسم العميل" required max={120} placeholder="جمعية راشد الخيرية" value={values.client_name[l] ?? ''} onChange={(v) => set('client_name', { ...values.client_name, [l]: v })} error={errors[`client_name.${l}`]} />
            </div>
            <TextField label="الوسم" required max={120} placeholder="نظام إدارة الكفالات" hint="كلمتان أو ثلاث فوق اسم المشروع في البطاقة." value={values.tag[l] ?? ''} onChange={(v) => set('tag', { ...values.tag, [l]: v })} error={errors[`tag.${l}`]} />
            <TextAreaField label="الوصف المختصر" required max={400} rows={3} hint="جملة أو جملتان: ماذا يفعل النظام ولمن." value={values.summary[l] ?? ''} onChange={(v) => set('summary', { ...values.summary, [l]: v })} error={errors[`summary.${l}`]} />
          </>
        )}
      </Translated>

      <Panel title="التصنيف والرابط">
        <TextField
          label="رابط المشروع"
          required
          dir="ltr"
          max={80}
          placeholder="rashid"
          hint={`أحرف إنجليزية صغيرة وأرقام وشرطات فقط. يظهر هكذا: ufuq.ps/work/${values.slug || '…'}`}
          value={values.slug}
          onChange={(v) => set('slug', v.toLowerCase().replace(/\s+/g, '-'))}
          error={errors.slug}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField label="نوع المشروع" value={values.type} options={TYPE_OPTIONS} onChange={(v) => set('type', v)} error={errors.type} />
          <SelectField label="القطاع" value={values.sector} options={SECTOR_OPTIONS} onChange={(v) => set('sector', v)} error={errors.sector} />
          <SelectField label="الدولة" value={values.country} options={COUNTRY_OPTIONS} onChange={(v) => set('country', v)} error={errors.country} />
        </div>
        <TagsInput label="التقنيات المستخدمة" max={8} hint="اكتب التقنية واضغط Enter. تظهر أسفل البطاقة." value={values.tech_stack} onChange={(v) => set('tech_stack', v)} error={errors.tech_stack ?? errors['tech_stack.0']} />
      </Panel>

      <Panel title="النشر والظهور">
        <SelectField label="الحالة" value={values.status} options={PUBLISH_OPTIONS} onChange={(v) => set('status', v)} error={errors.status} />
        <Toggle
          label="مشروع مميز"
          description="يظهر في قسم «أعمالنا» في الصفحة الرئيسية بطريقة العرض التي تختارها."
          checked={values.is_featured}
          onChange={(v) => {
            set('is_featured', v)
            // A featured project needs a layout; the first one fits most systems.
            if (v && !values.featured_layout) set('featured_layout', 'showcase')
          }}
        />
        {values.is_featured && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="الترتيب بين المميزة" type="number" dir="ltr" hint="١ يظهر أولاً." value={String(values.featured_order)} onChange={(v) => set('featured_order', Math.max(0, Number(v) || 0))} error={errors.featured_order} />
            <SelectField
              label="طريقة العرض"
              required
              value={values.featured_layout ?? ''}
              emptyLabel="اختر طريقة العرض"
              options={LAYOUT_OPTIONS}
              hint={values.featured_layout ? LAYOUT_HINT[values.featured_layout] : 'كيف يُعرض المشروع وشاشاته في «أعمالنا».'}
              onChange={(v) => set('featured_layout', v)}
              error={errors.featured_layout}
            />
          </div>
        )}
        <Toggle label="الشاشات ببيانات تجريبية" description="تظهر ملاحظة تحت الشاشات بأن البيانات ليست حقيقية." checked={values.has_demo_data} onChange={(v) => set('has_demo_data', v)} />
      </Panel>
    </div>
  )
}
