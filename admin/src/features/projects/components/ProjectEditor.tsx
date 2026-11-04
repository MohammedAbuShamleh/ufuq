import { useParams, useSearchParams } from 'react-router'
import { Badge, ErrorState, FormActions, Loading, PageHeader } from '@/components/Page'
import { Button } from '@/components/ui/Button'
import { useResourceForm } from '@/hooks/useResourceForm'
import { ar } from '@/lib/i18n'
import { blankProject, projects, toProjectInput } from '../api'
import { BasicsTab } from './editor/BasicsTab'
import { CardPreview } from './editor/CardPreview'
import { EditorTabs } from './editor/EditorTabs'
import { FactsTab } from './editor/FactsTab'
import { StoryTab } from './editor/StoryTab'
import { TABS, tabOfField, type EditorTab } from './editor/tabProps'
import { ScreensTab } from './screens/ScreensTab'

/**
 * Add or edit a project. The text tabs share one form saved by the button at
 * the bottom; screens upload on their own once the project exists. The tab
 * lives in the URL (?tab=screens) so a reload keeps the place.
 */
export function ProjectEditor() {
  const param = useParams().id
  const id = param ? Number(param) : null
  // A new project opens on its screens: the next thing to add.
  const form = useResourceForm(projects, id, toProjectInput, blankProject, { createdPath: (newId) => `/projects/${newId}?tab=screens` })
  const [params, setParams] = useSearchParams()
  const saved = form.item.data

  const requested = params.get('tab')
  const tab: EditorTab = TABS.some((t) => t.key === requested) ? (requested as EditorTab) : 'basics'
  const go = (next: EditorTab) => setParams(next === 'basics' ? {} : { tab: next }, { replace: true })

  const withErrors = [...new Set(Object.keys(form.errors).map(tabOfField))]
  const { values } = form

  return (
    <>
      <PageHeader
        title={id === null ? 'مشروع جديد' : ar(saved?.title) || 'مشروع'}
        back={{ to: '/projects', label: 'المشاريع' }}
        actions={saved && (saved.status === 'published' ? <Badge tone="ok">منشور</Badge> : <Badge>مسودة</Badge>)}
      />
      {!values ? (
        form.item.isError ? <ErrorState error={form.item.error} /> : <Loading />
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            form.submit((fields) => go(tabOfField(fields[0])))
          }}
        >
          <EditorTabs active={tab} onChange={go} withErrors={withErrors} counts={{ screens: saved?.screens.length }} />
          <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'basics' && <BasicsTab values={values} set={form.set} errors={form.errors} />}
            {tab === 'story' && <StoryTab values={values} set={form.set} errors={form.errors} />}
            {tab === 'facts' && <FactsTab values={values} set={form.set} errors={form.errors} />}
            {tab === 'screens' && <ScreensTab projectId={saved?.id ?? null} screens={saved?.screens ?? []} />}
            {tab === 'preview' && <CardPreview values={values} screens={saved?.screens ?? []} saved={saved ? { slug: saved.slug, published: saved.status === 'published' } : null} />}
          </div>
          <FormActions note={form.dirty ? 'تعديلات لم تُحفظ بعد' : tab === 'screens' ? 'الشاشات تُحفظ فور رفعها.' : undefined}>
            {saved && (
              <Button variant="danger" busy={form.removing} onClick={() => void form.destroy(ar(saved.title) || saved.slug)}>
                حذف المشروع
              </Button>
            )}
            <Button type="submit" busy={form.saving}>
              {id === null ? 'حفظ والمتابعة للشاشات' : 'حفظ'}
            </Button>
          </FormActions>
        </form>
      )}
    </>
  )
}
