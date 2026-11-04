import { useParams } from 'react-router'
import { ErrorState, FormActions, Loading, PageHeader, Panel } from '@/components/Page'
import { Button } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import { useUser } from '@/features/auth/hooks/useAuth'
import { useResourceForm } from '@/hooks/useResourceForm'
import { blankUser, ROLE_OPTIONS, toUserInput, users } from '../api'

export function UserForm() {
  const param = useParams().id
  const id = param ? Number(param) : null
  const me = useUser()
  const form = useResourceForm(users, id, toUserInput, blankUser, { offSite: true })
  const { values, set, errors } = form
  const saved = form.item.data
  const self = saved?.id === me.id

  return (
    <>
      <PageHeader title={id === null ? 'مستخدم جديد' : 'تعديل المستخدم'} back={{ to: '/users', label: 'المستخدمون' }} />
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
          <Panel>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="الاسم" required value={values.name} onChange={(v) => set('name', v)} error={errors.name} />
              <TextField label="البريد الإلكتروني" required type="email" dir="ltr" autoComplete="off" value={values.email} onChange={(v) => set('email', v)} error={errors.email} />
            </div>
            <SelectField
              label="الصلاحية"
              value={values.role}
              options={ROLE_OPTIONS}
              onChange={(v) => set('role', v)}
              error={errors.role}
              hint={self ? 'لا يمكنك تغيير صلاحيتك بنفسك؛ يغيّرها مدير آخر.' : undefined}
            />
            <TextField
              label={id === null ? 'كلمة المرور' : 'كلمة مرور جديدة'}
              required={id === null}
              type="password"
              dir="ltr"
              autoComplete="new-password"
              hint={id === null ? '١٠ أحرف على الأقل. أرسلها للشخص بطريقة آمنة.' : 'اتركها فارغة لتبقى كلمة المرور الحالية.'}
              value={values.password}
              onChange={(v) => set('password', v)}
              error={errors.password}
            />
          </Panel>
          <FormActions note={form.dirty ? 'تعديلات لم تُحفظ بعد' : undefined}>
            {saved && !self && (
              <Button variant="danger" busy={form.removing} onClick={() => void form.destroy(saved.name, true)}>
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
