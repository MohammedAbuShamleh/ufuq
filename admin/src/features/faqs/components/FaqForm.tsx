import { useParams } from 'react-router'
import { ErrorState, FormActions, Loading, PageHeader, Panel } from '@/components/Page'
import { Translated } from '@/components/Translated'
import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { useResourceForm } from '@/hooks/useResourceForm'
import { ar } from '@/lib/i18n'
import { blankFaq, faqs, toFaqInput } from '../api'

export function FaqForm() {
  const param = useParams().id
  const id = param ? Number(param) : null
  const form = useResourceForm(faqs, id, toFaqInput, blankFaq)
  const { values, set, errors } = form

  return (
    <>
      <PageHeader title={id === null ? 'سؤال جديد' : 'تعديل السؤال'} back={{ to: '/faqs', label: 'الأسئلة الشائعة' }} />
      {!values ? (
        form.item.isError ? <ErrorState error={form.item.error} /> : <Loading />
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            form.submit()
          }}
          className="grid gap-6"
        >
          <Translated>
            {(l) => (
              <>
                <TextField label="السؤال" required max={200} value={values.question[l] ?? ''} onChange={(v) => set('question', { ...values.question, [l]: v })} error={errors[`question.${l}`]} />
                <TextAreaField label="الجواب" required max={1200} rows={6} value={values.answer[l] ?? ''} onChange={(v) => set('answer', { ...values.answer, [l]: v })} error={errors[`answer.${l}`]} />
              </>
            )}
          </Translated>
          <Panel>
            <Toggle label="ظاهر في الموقع" description="أطفئه لإخفاء السؤال دون حذفه." checked={values.is_visible} onChange={(v) => set('is_visible', v)} />
          </Panel>
          <FormActions note={form.dirty ? 'تعديلات لم تُحفظ بعد' : undefined}>
            {id !== null && (
              <Button variant="danger" busy={form.removing} onClick={() => void form.destroy(ar(values.question) || 'السؤال')}>
                حذف
              </Button>
            )}
            <Button type="submit" busy={form.saving}>
              حفظ
            </Button>
          </FormActions>
        </form>
      )}
    </>
  )
}
