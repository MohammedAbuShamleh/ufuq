import { EmptyState, Panel } from '@/components/Page'
import { SortableList } from '@/components/SortableList'
import { SAVED, useToast } from '@/components/toast/toast'
import { errorMessage } from '@/lib/http'
import { ar } from '@/lib/i18n'
import { useScreens } from '../../hooks/useScreens'
import { tabOptions } from '../../screens'
import type { Screen } from '../../types'
import { ScreenCard } from './ScreenCard'
import { ScreenUploads } from './ScreenUploads'

/**
 * The project's shots as the site shows them: desktop shots and videos become
 * tabs over the browser frame, in this order; phone shots sit beside it and
 * may follow a tab. The first shot is the project's cover.
 */
export function ScreensTab({ projectId, screens }: { projectId: number | null; screens: Screen[] }) {
  if (projectId === null) {
    return <EmptyState title="احفظ المشروع أولاً" body="بعد الحفظ الأول تُرفع الشاشات من هنا، ويُحفظ كل ملف فور رفعه." />
  }
  return <Screens projectId={projectId} screens={screens} />
}

function Screens({ projectId, screens }: { projectId: number; screens: Screen[] }) {
  const actions = useScreens(projectId)
  const toast = useToast()
  const tabs = tabOptions(screens)

  return (
    <div className="grid gap-6">
      <Panel title="إضافة شاشات" description="كل ملف يُحفظ فور رفعه، دون حاجة لزر «حفظ» أسفل الصفحة.">
        <ScreenUploads projectId={projectId} saved={screens} />
      </Panel>

      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-base font-semibold">شاشات المشروع</h2>
          <p className="text-xs text-muted">الأولى هي صورة الغلاف في قائمة الأعمال. اسحب من المقبض لتغيير الترتيب.</p>
        </div>
        {screens.length === 0 ? (
          <EmptyState title="لا شاشات بعد" body="مشروع بلا شاشات يظهر في الموقع ببطاقة نصية فقط." />
        ) : (
          <SortableList
            layout="grid"
            items={screens}
            name={(s) => ar(s.alt) || 'شاشة'}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            onReorder={(ids) => actions.reorder.mutate(ids, { onSuccess: () => toast.ok(SAVED), onError: (e) => toast.error(errorMessage(e)) })}
          >
            {(screen, handle) => <ScreenCard screen={screen} allScreens={screens} tabs={tabs} actions={actions} handle={handle} />}
          </SortableList>
        )}
      </section>
    </div>
  )
}
