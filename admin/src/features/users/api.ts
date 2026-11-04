import type { Role, User } from '@/features/auth/types'
import { resource } from '@/lib/resource'

/** password is required for a new user and optional on edit (empty keeps the current one). */
export type UserInput = { name: string; email: string; role: Role; password: string }

export const users = resource<User, UserInput>('users')

export const toUserInput = (u: User): UserInput => ({ name: u.name, email: u.email, role: u.role, password: '' })

export const blankUser = (): UserInput => ({ name: '', email: '', role: 'editor', password: '' })

export const ROLE_OPTIONS: readonly { value: Role; label: string }[] = [
  { value: 'editor', label: 'محرّر — المحتوى ورسائل التواصل' },
  { value: 'admin', label: 'مدير — كل شيء، ومنه الإعدادات والمستخدمون' },
]
