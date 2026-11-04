import type { ProjectInput } from '../../types'

/** What every tab of the project form receives: the values, a setter and the server's errors. */
export type TabProps = {
  values: ProjectInput
  set: <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => void
  errors: Record<string, string>
}

export type EditorTab = 'basics' | 'story' | 'facts' | 'screens' | 'preview'

export const TABS: { key: EditorTab; label: string }[] = [
  { key: 'basics', label: 'الأساسيات' },
  { key: 'story', label: 'القصة' },
  { key: 'facts', label: 'الأرقام والنقاط' },
  { key: 'screens', label: 'الشاشات' },
  { key: 'preview', label: 'المعاينة' },
]

const STORY = ['challenge', 'solution', 'results']
const FACTS = ['featured_facts', 'facts', 'highlights']

/** The tab that holds a field, so a failed save can open it. */
export function tabOfField(field: string): EditorTab {
  const root = field.split('.')[0]
  if (STORY.includes(root)) return 'story'
  if (FACTS.includes(root)) return 'facts'
  return 'basics'
}
