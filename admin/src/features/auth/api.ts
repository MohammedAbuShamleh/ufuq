import { api, ApiError } from '@/lib/http'
import type { Envelope } from '@/lib/types'
import type { LoginInput, User } from './types'

/** The signed-in user, or null when the session is missing or expired. */
export async function fetchMe(): Promise<User | null> {
  try {
    return (await api<Envelope<User>>('/me')).data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

export const login = (input: LoginInput) => api<Envelope<User>>('/login', { method: 'POST', body: input }).then((r) => r.data)

export const logout = () => api<void>('/logout', { method: 'POST' })
