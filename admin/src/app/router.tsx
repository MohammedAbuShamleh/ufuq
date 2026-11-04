import type { ComponentType, ReactNode } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { RequireAdmin, RequireAuth } from '@/features/auth/components/RequireAuth'
import { ClientForm } from '@/features/clients/components/ClientForm'
import { ClientsPage } from '@/features/clients/components/ClientsPage'
import { FaqForm } from '@/features/faqs/components/FaqForm'
import { FaqsPage } from '@/features/faqs/components/FaqsPage'
import { LeadDetail } from '@/features/leads/components/LeadDetail'
import { LeadsPage } from '@/features/leads/components/LeadsPage'
import { ProjectEditor } from '@/features/projects/components/ProjectEditor'
import { ProjectsPage } from '@/features/projects/components/ProjectsPage'
import { SettingsPage } from '@/features/settings/components/SettingsPage'
import { TeamForm } from '@/features/team/components/TeamForm'
import { TeamPage } from '@/features/team/components/TeamPage'
import { TestimonialForm } from '@/features/testimonials/components/TestimonialForm'
import { TestimonialsPage } from '@/features/testimonials/components/TestimonialsPage'
import { UserForm } from '@/features/users/components/UserForm'
import { UsersPage } from '@/features/users/components/UsersPage'
import { NotFound } from './shell/NotFound'
import { AppShell } from './shell/AppShell'

/** A list, its "new" form and its edit form, for each section. */
const crud = (path: string, List: ComponentType, Form: ComponentType, admin = false): RouteObject[] => {
  const guard = (el: ReactNode) => (admin ? <RequireAdmin>{el}</RequireAdmin> : el)
  return [
    { path, element: guard(<List />) },
    { path: `${path}/new`, element: guard(<Form />) },
    { path: `${path}/:id`, element: guard(<Form />) },
  ]
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/projects" replace /> },
      ...crud('projects', ProjectsPage, ProjectEditor),
      ...crud('team', TeamPage, TeamForm),
      ...crud('testimonials', TestimonialsPage, TestimonialForm),
      ...crud('clients', ClientsPage, ClientForm),
      ...crud('faqs', FaqsPage, FaqForm),
      ...crud('users', UsersPage, UserForm, true),
      { path: 'leads', element: <LeadsPage /> },
      { path: 'leads/:id', element: <LeadDetail /> },
      {
        path: 'settings',
        element: (
          <RequireAdmin>
            <SettingsPage />
          </RequireAdmin>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
