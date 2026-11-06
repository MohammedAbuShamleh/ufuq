import { useParams } from 'react-router'
import { ErrorState, FormActions, Loading, PageHeader, Panel } from '@/components/Page'
import { Translated } from '@/components/Translated'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { projects } from '@/features/projects/api'
import { useResourceForm } from '@/hooks/useResourceForm'
import { ar } from '@/lib/i18n'
import { PUBLISH_OPTIONS } from '@/lib/types'
import { blankTestimonial, testimonials, toTestimonialInput } from '../api'

const NO_PROJECT = 'none'

export function TestimonialForm() {
  const param = useParams().id
  const id = param ? Number(param) : null
  const form = useResourceForm(testimonials, id, toTestimonialInput, blankTestimonial)
  const projectList = projects.useList()
  const { values, set, errors } = form
  const saved = form.item.data

  const projectOptions = [{ value: NO_PROJECT, label: 'بلا مشروع' }, ...(projectList.data ?? []).map((p) => ({ value: String(p.id), label: ar(p.title) || p.slug }))]

  return (
    <>
      <PageHeader title={id === null ? 'شهادة جديدة' : 'تعديل الشهادة'} back={{ to: '/testimonials', label: 'الشهادات' }} />
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
          <Translated errors={errors} fields={['quote', 'author_name', 'author_title', 'organization']}>
            {(l) => (
              <>
                <TextAreaField label="نص الشهادة" required max={600} rows={5} hint="بكلمات العميل كما قالها، دون علامات تنصيص." value={values.quote[l] ?? ''} onChange={(v) => set('quote', { ...values.quote, [l]: v })} error={errors[`quote.${l}`]} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="اسم صاحب الشهادة" required max={80} value={values.author_name[l] ?? ''} onChange={(v) => set('author_name', { ...values.author_name, [l]: v })} error={errors[`author_name.${l}`]} />
                  <TextField label="منصبه" required max={80} placeholder="مدير الجمعية" value={values.author_title[l] ?? ''} onChange={(v) => set('author_title', { ...values.author_title, [l]: v })} error={errors[`author_title.${l}`]} />
                </div>
                <TextField label="الجهة" required max={120} value={values.organization[l] ?? ''} onChange={(v) => set('organization', { ...values.organization, [l]: v })} error={errors[`organization.${l}`]} />
              </>
            )}
          </Translated>
          <Panel>
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="المشروع المرتبط"
                hint="اختياري: تظهر الشهادة أيضاً في صفحة هذا المشروع."
                value={values.project_id === null ? NO_PROJECT : String(values.project_id)}
                options={projectOptions}
                onChange={(v) => set('project_id', v === NO_PROJECT ? null : Number(v))}
                error={errors.project_id}
              />
              <SelectField label="الحالة" value={values.status} options={PUBLISH_OPTIONS} onChange={(v) => set('status', v)} error={errors.status} />
            </div>
          </Panel>
          <FormActions note={form.dirty ? 'تعديلات لم تُحفظ بعد' : undefined}>
            {saved && (
              <Button variant="danger" busy={form.removing} onClick={() => void form.destroy(`شهادة ${ar(saved.author_name) || ar(saved.organization)}`)}>
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
