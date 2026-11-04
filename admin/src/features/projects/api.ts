import { api, upload } from '@/lib/http'
import { blank, tr, type T } from '@/lib/i18n'
import { resource } from '@/lib/resource'
import type { Envelope } from '@/lib/types'
import type { Project, ProjectInput, ProjectRow, Screen, ScreenInput } from './types'

export const projects = resource<Project, ProjectInput, ProjectRow>('projects')

export const toProjectInput = (p: Project): ProjectInput => ({
  slug: p.slug,
  title: tr(p.title),
  client_name: tr(p.client_name),
  summary: tr(p.summary),
  tag: tr(p.tag),
  challenge: tr(p.challenge),
  solution: tr(p.solution),
  results: tr(p.results),
  type: p.type,
  sector: p.sector,
  country: p.country ?? 'PS',
  tech_stack: p.tech_stack ?? [],
  is_featured: p.is_featured,
  featured_order: p.featured_order,
  featured_layout: p.featured_layout,
  featured_facts: p.featured_facts.map((f) => ({ value: f.value, label: tr(f.label) })),
  has_demo_data: p.has_demo_data,
  status: p.status,
  facts: p.facts.map((f) => ({ id: f.id, value: f.value, label: tr(f.label) })),
  highlights: p.highlights.map((h) => ({ id: h.id, text: tr(h.text) })),
})

export const blankProject = (): ProjectInput => ({
  slug: '',
  title: blank(),
  client_name: blank(),
  summary: blank(),
  tag: blank(),
  challenge: blank(),
  solution: blank(),
  results: blank(),
  type: 'system',
  sector: 'charity',
  country: 'PS',
  tech_stack: [],
  is_featured: false,
  featured_order: 0,
  featured_layout: null,
  featured_facts: [],
  has_demo_data: false,
  status: 'draft',
  facts: [],
  highlights: [],
})

export function uploadScreen(projectId: number, file: File, input: ScreenInput, onProgress: (f: number) => void) {
  const form = new FormData()
  form.append('file', file)
  form.append('kind', input.kind)
  appendT(form, 'label', input.label)
  appendT(form, 'alt', input.alt)
  return upload<Envelope<Screen>>(`/projects/${projectId}/screens`, form, onProgress).then((r) => r.data)
}

export const updateScreen = (projectId: number, screenId: number, input: Partial<ScreenInput>) =>
  api<Envelope<Screen>>(`/projects/${projectId}/screens/${screenId}`, { method: 'PATCH', body: input }).then((r) => r.data)

export const deleteScreen = (projectId: number, screenId: number) => api<void>(`/projects/${projectId}/screens/${screenId}`, { method: 'DELETE' })

export const reorderScreens = (projectId: number, ids: number[]) => api<void>(`/projects/${projectId}/screens/reorder`, { method: 'POST', body: { ids } })

/** Translated text in multipart: label[ar]=… */
function appendT(form: FormData, field: string, value: T) {
  for (const [locale, text] of Object.entries(value)) if (text) form.append(`${field}[${locale}]`, text)
}
