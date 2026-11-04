export type Role = 'admin' | 'editor'

export type User = { id: number; name: string; email: string; role: Role }

export type LoginInput = { email: string; password: string; remember: boolean }

export const ROLE_LABEL: Record<Role, string> = { admin: 'مدير', editor: 'محرّر' }
