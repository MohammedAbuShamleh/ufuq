import { useParams } from 'react-router'
import { ErrorState, FormActions, Loading, PageHeader, Panel } from '@/components/Page'
import { Translated } from '@/components/Translated'
import { LOGO } from '@/components/upload/files'
import { SingleUpload } from '@/components/upload/SingleUpload'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { useResourceForm } from '@/hooks/useResourceForm'
import { useStoreRecord } from '@/hooks/useStoreRecord'
import { ar } from '@/lib/i18n'
import { blankClient, clients, removeLogo, toClientInput, uploadLogo } from '../api'
import type { Client } from '../types'

export function ClientForm() {
  const param = useParams().id
  const id = param ? Number(param) : null
  const form = useResourceForm(clients, id, toClientInput, blankClient)
  const store = useStoreRecord<Client>(clients.keys)
  const { values, set, errors } = form
  const saved = form.item.data

  return (
    <>
      <PageHeader title={id === null ? 'عميل جديد' : 'تعديل العميل'} back={{ to: '/clients', label: 'العملاء' }} />
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
          <Translated errors={errors} fields={['name', 'sector_label', 'location']}>
            {(l) => (
              <>
                <TextField label="اسم العميل" required max={120} value={values.name[l] ?? ''} onChange={(v) => set('name', { ...values.name, [l]: v })} error={errors[`name.${l}`]} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="المجال" required max={60} placeholder="جمعية خيرية" value={values.sector_label[l] ?? ''} onChange={(v) => set('sector_label', { ...values.sector_label, [l]: v })} error={errors[`sector_label.${l}`]} />
                  <TextField label="المكان" required max={60} placeholder="نابلس" value={values.location[l] ?? ''} onChange={(v) => set('location', { ...values.location, [l]: v })} error={errors[`location.${l}`]} />
                </div>
              </>
            )}
          </Translated>
          <Panel>
            {saved ? (
              <SingleUpload
                label="الشعار"
                current={saved.logo}
                rules={[LOGO]}
                hint="PNG أو SVG بخلفية شفافة أفضل. حتى ٤ ميغابايت."
                upload={async (file, p) => store(await uploadLogo(saved.id, file, p))}
                remove={async () => store(await removeLogo(saved.id))}
              />
            ) : (
              <p className="text-sm text-muted">احفظ العميل أولاً، ثم ارفع شعاره من هنا.</p>
            )}
            <Toggle label="ظاهر في الموقع" description="أطفئه لإخفاء العميل دون حذفه." checked={values.is_visible} onChange={(v) => set('is_visible', v)} />
          </Panel>
          <FormActions note={form.dirty ? 'تعديلات لم تُحفظ بعد' : undefined}>
            {saved && (
              <Button variant="danger" busy={form.removing} onClick={() => void form.destroy(ar(saved.name) || 'العميل')}>
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
