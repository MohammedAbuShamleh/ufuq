import { useParams } from 'react-router'
import { ErrorState, FormActions, Loading, PageHeader, Panel } from '@/components/Page'
import { Translated } from '@/components/Translated'
import { PHOTO } from '@/components/upload/files'
import { usePhotoCropper } from '@/components/upload/PhotoCropper'
import { SingleUpload } from '@/components/upload/SingleUpload'
import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { useResourceForm } from '@/hooks/useResourceForm'
import { useStoreRecord } from '@/hooks/useStoreRecord'
import { ar } from '@/lib/i18n'
import { blankMember, removePhoto, team, toMemberInput, uploadPhoto } from '../api'
import type { Member } from '../types'

export function TeamForm() {
  const param = useParams().id
  const id = param ? Number(param) : null
  const form = useResourceForm(team, id, toMemberInput, blankMember)
  const store = useStoreRecord<Member>(team.keys)
  const cropper = usePhotoCropper()
  const { values, set, errors } = form
  const saved = form.item.data

  return (
    <>
      <PageHeader title={id === null ? 'عضو جديد' : 'تعديل العضو'} back={{ to: '/team', label: 'الفريق' }} />
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
          <Translated errors={errors} fields={['name', 'role', 'bio']}>
            {(l) => (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="الاسم" required max={80} value={values.name[l] ?? ''} onChange={(v) => set('name', { ...values.name, [l]: v })} error={errors[`name.${l}`]} />
                  <TextField label="الدور" required max={80} placeholder="مطوّر واجهات" value={values.role[l] ?? ''} onChange={(v) => set('role', { ...values.role, [l]: v })} error={errors[`role.${l}`]} />
                </div>
                <TextAreaField label="نبذة" max={600} hint="سطران أو ثلاثة عن خبرته. تظهر في بطاقته." value={values.bio[l] ?? ''} onChange={(v) => set('bio', { ...values.bio, [l]: v })} error={errors[`bio.${l}`]} />
              </>
            )}
          </Translated>
          <Panel>
            <TextField label="التقنيات" dir="ltr" max={120} placeholder="React · Laravel · Flutter" hint="تُكتب بالإنجليزية كما هي، وتفصل بينها بنقطة." value={values.tech} onChange={(v) => set('tech', v)} error={errors.tech} />
            {saved ? (
              <SingleUpload
                label="الصورة"
                shape="square"
                current={saved.photo}
                rules={[PHOTO]}
                hint="تُقصّ مربعاً قبل الرفع. صورة واضحة للوجه بخلفية هادئة."
                prepare={cropper.prepare}
                upload={async (file, p) => store(await uploadPhoto(saved.id, file, p))}
                remove={async () => store(await removePhoto(saved.id))}
              />
            ) : (
              <p className="text-sm text-muted">احفظ العضو أولاً، ثم ارفع صورته من هنا.</p>
            )}
            <Toggle label="من المؤسسين" description="تظهر بطاقته في صف المؤسسين أعلى الصفحة." checked={values.is_founder} onChange={(v) => set('is_founder', v)} />
            <Toggle label="ظاهر في الموقع" description="أطفئه لإخفاء العضو دون حذفه." checked={values.is_visible} onChange={(v) => set('is_visible', v)} />
          </Panel>
          <FormActions note={form.dirty ? 'تعديلات لم تُحفظ بعد' : undefined}>
            {saved && (
              <Button variant="danger" busy={form.removing} onClick={() => void form.destroy(ar(saved.name) || 'العضو')}>
                حذف
              </Button>
            )}
            <Button type="submit" busy={form.saving}>
              حفظ
            </Button>
          </FormActions>
        </form>
      )}
      {cropper.dialog}
    </>
  )
}
