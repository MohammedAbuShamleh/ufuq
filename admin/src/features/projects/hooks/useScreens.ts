import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteScreen, projects, reorderScreens, updateScreen, uploadScreen } from '../api'
import type { Project, Screen, ScreenInput } from '../types'

/**
 * A project's screens change one by one, outside the project form: each
 * upload, edit, delete and reorder is saved at once and patched into the
 * cached project, so the form's unsaved text is never touched.
 */
export function useScreens(projectId: number) {
  const qc = useQueryClient()
  const key = projects.keys.item(projectId)

  const patch = (fn: (screens: Screen[]) => Screen[]) => {
    qc.setQueryData<Project>(key, (p) => (p ? { ...p, screens: fn(p.screens) } : p))
    // The list shows the cover and the screen count.
    void qc.invalidateQueries({ queryKey: projects.keys.list })
  }

  const upload = (file: File, input: ScreenInput, onProgress: (f: number) => void) =>
    uploadScreen(projectId, file, input, onProgress).then((screen) => {
      patch((all) => [...all, screen])
      return screen
    })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<ScreenInput> }) => updateScreen(projectId, id, input),
    onSuccess: (screen) => patch((all) => all.map((s) => (s.id === screen.id ? screen : s))),
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteScreen(projectId, id),
    onSuccess: (_, id) => patch((all) => all.filter((s) => s.id !== id)),
  })

  const reorder = useMutation({
    mutationFn: (ids: number[]) => reorderScreens(projectId, ids),
    onMutate: (ids) => {
      const previous = qc.getQueryData<Project>(key)?.screens
      patch((all) => ids.flatMap((id) => all.find((s) => s.id === id) ?? []))
      return { previous }
    },
    onError: (_e, _ids, ctx) => {
      if (ctx?.previous) patch(() => ctx.previous!)
    },
  })

  return { upload, update, remove, reorder }
}
