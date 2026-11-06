import { useState } from 'react'
import { ErrorState, FormActions, Loading, PageHeader, Panel } from '@/components/Page'
import { SAVED, useToast } from '@/components/toast/toast'
import { Translated } from '@/components/Translated'
import { PDF } from '@/components/upload/files'
import { SingleUpload } from '@/components/upload/SingleUpload'
import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { useUnsavedGuard } from '@/hooks/useUnsavedGuard'
import { errorMessage, fieldErrors } from '@/lib/http'
import { removeProfilePdf, toSettingsInput, uploadProfilePdf } from '../api'
import { useSaveSettings, useSettings, useStoreSettings } from '../hooks/useSettings'
import type { Settings, SettingsInput } from '../types'
import { PolicyEditor } from './PolicyEditor'

export function SettingsPage() {
  const settings = useSettings()

  return (
    <>
      <PageHeader title="الإعدادات" description="بيانات التواصل ونصوص الموقع العامة. الحقل الفارغ يظهر في الموقع «قيد الإعداد»." />
      {settings.isPending ? <Loading /> : settings.isError ? <ErrorState error={settings.error} onRetry={() => void settings.refetch()} /> : <SettingsForm saved={settings.data} />}
    </>
  )
}

function SettingsForm({ saved }: { saved: Settings }) {
  const save = useSaveSettings()
  const store = useStoreSettings()
  const toast = useToast()
  const [draft, setDraft] = useState<SettingsInput | null>(null)
  useUnsavedGuard(draft !== null)

  const values = draft ?? toSettingsInput(saved)
  const set = <K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) => setDraft({ ...values, [key]: value })
  const errors = fieldErrors(save.error)
  const social = (key: keyof SettingsInput['social_links'], v: string) => set('social_links', { ...values.social_links, [key]: v })

  const submit = () =>
    save.mutate(values, {
      onSuccess: () => {
        setDraft(null)
        toast.ok(SAVED)
      },
      onError: (e) => toast.error(errorMessage(e)),
    })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="grid gap-6"
    >
      <Panel title="التواصل" description="تظهر في التذييل وصفحة التواصل وأزرار واتساب.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="رقم واتساب" dir="ltr" placeholder="+970599000000" hint="بالصيغة الدولية، مع رمز الدولة." value={values.whatsapp_number} onChange={(v) => set('whatsapp_number', v)} error={errors.whatsapp_number} />
          <TextField label="بريد التواصل" type="email" dir="ltr" value={values.contact_email} onChange={(v) => set('contact_email', v)} error={errors.contact_email} />
        </div>
        <TextField label="رابط حجز الجلسة" dir="ltr" placeholder="https://cal.com/…" hint="زر «احجز جلسة» يفتح هذا الرابط." value={values.booking_url} onChange={(v) => set('booking_url', v)} error={errors.booking_url} />
      </Panel>

      <Panel title="حسابات التواصل الاجتماعي" description="الرابط الكامل لكل حساب. اترك الحقل فارغاً إن لم يكن الحساب جاهزاً.">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="لينكدإن" dir="ltr" value={values.social_links.linkedin} onChange={(v) => social('linkedin', v)} error={errors['social_links.linkedin']} />
          <TextField label="إكس" dir="ltr" value={values.social_links.x} onChange={(v) => social('x', v)} error={errors['social_links.x']} />
          <TextField label="إنستغرام" dir="ltr" value={values.social_links.instagram} onChange={(v) => social('instagram', v)} error={errors['social_links.instagram']} />
        </div>
      </Panel>

      <Panel title="ملف البروفايل">
        <SingleUpload
          label="ملف البروفايل"
          shape="file"
          current={saved.profile_pdf}
          rules={[PDF]}
          hint="PDF حتى ٢٠ ميغابايت. يُرفع فوراً دون حاجة لزر الحفظ."
          upload={async (file, p) => store(await uploadProfilePdf(file, p))}
          remove={async () => store(await removeProfilePdf())}
        />
      </Panel>

      <Translated title="نصوص الموقع" errors={errors} fields={['hero_tagline', 'why_we_started', 'legal_registration', 'memberships']}>
        {(l) => (
          <>
            <TextField label="السطر التعريفي" max={160} hint="تحت الشعار في التذييل وفي وصف الموقع." value={values.hero_tagline[l] ?? ''} onChange={(v) => set('hero_tagline', { ...values.hero_tagline, [l]: v })} error={errors[`hero_tagline.${l}`]} />
            <TextAreaField label="لماذا بدأنا" rows={5} hint="قصة البداية في صفحة «من نحن» والصفحة الرئيسية." value={values.why_we_started[l] ?? ''} onChange={(v) => set('why_we_started', { ...values.why_we_started, [l]: v })} error={errors[`why_we_started.${l}`]} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="التسجيل القانوني" placeholder="شركة مسجلة في فلسطين برقم …" value={values.legal_registration[l] ?? ''} onChange={(v) => set('legal_registration', { ...values.legal_registration, [l]: v })} error={errors[`legal_registration.${l}`]} />
              <TextField label="العضويات" placeholder="عضو اتحاد شركات أنظمة المعلومات (بيتا)" value={values.memberships[l] ?? ''} onChange={(v) => set('memberships', { ...values.memberships, [l]: v })} error={errors[`memberships.${l}`]} />
            </div>
          </>
        )}
      </Translated>

      <Translated title="سياسة الخصوصية" errors={errors} fields={['privacy_policy']}>
        {(l) => (
          <PolicyEditor
            sections={values.privacy_policy[l] ?? []}
            onChange={(sections) => set('privacy_policy', { ...values.privacy_policy, [l]: sections })}
            errorAt={(path) => errors[`privacy_policy.${l}.${path}`] ?? errors[`privacy_policy.${l}.${path}.0`]}
          />
        )}
      </Translated>
      <Panel>
        <Toggle label="سياسة الخصوصية مسودة للمراجعة" description="تظهر شارة «مسودة» أعلى صفحة الخصوصية حتى يراجعها مختص قانوني." checked={values.privacy_is_draft} onChange={(v) => set('privacy_is_draft', v)} />
      </Panel>

      <FormActions note={draft ? 'تعديلات لم تُحفظ بعد' : undefined}>
        {draft && (
          <Button variant="ghost" onClick={() => setDraft(null)}>
            تجاهل التعديلات
          </Button>
        )}
        <Button type="submit" busy={save.isPending}>
          حفظ الإعدادات
        </Button>
      </FormActions>
    </form>
  )
}
