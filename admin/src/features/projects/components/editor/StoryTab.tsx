import { Translated } from '@/components/Translated'
import { TextAreaField } from '@/components/ui/Field'
import type { TabProps } from './tabProps'

/** The three parts of the project page. Empty parts show there as «قيد الإعداد». */
export function StoryTab({ values, set, errors }: TabProps) {
  const field = (key: 'challenge' | 'solution' | 'results', label: string, hint: string) => (l: 'ar' | 'en') => (
    <TextAreaField label={label} hint={hint} max={2000} rows={6} value={values[key][l] ?? ''} onChange={(v) => set(key, { ...values[key], [l]: v })} error={errors[`${key}.${l}`]} />
  )

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-relaxed text-muted">قصة المشروع في صفحته على الموقع. اكتبها بلغة العميل لا بلغة المبرمجين، وكل جزء فقرة أو فقرتان.</p>
      <Translated>
        {(l) => (
          <>
            {field('challenge', 'التحدي', 'ما المشكلة التي كانت عند العميل قبلنا؟')(l)}
            {field('solution', 'الحل', 'ماذا صنعنا، وكيف يستخدمه فريقه كل يوم؟')(l)}
            {field('results', 'النتائج', 'ما الذي تغيّر بعد التشغيل؟ أرقام إن وُجدت.')(l)}
          </>
        )}
      </Translated>
    </div>
  )
}
