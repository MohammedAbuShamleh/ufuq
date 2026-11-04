import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, use } from 'react'
import { fetchMe, login, logout } from '../api'
import type { User } from '../types'

export const ME_KEY = ['me'] as const

export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: fetchMe, staleTime: 5 * 60_000, retry: false })
}

/**
 * RequireAuth provides the user it checked. Reading it from context, not the query,
 * keeps a child that re-renders on its own (the logout button) from seeing the
 * signed-out state before RequireAuth has redirected.
 */
export const UserContext = createContext<User | null>(null)

/** The user inside the signed-in area. */
export function useUser(): User {
  const user = use(UserContext)
  if (!user) throw new Error('useUser called outside the signed-in area')
  return user
}

/** What the role may open. The server enforces the same rules through its policies. */
export function useCan() {
  const user = useUser()
  const admin = user.role === 'admin'
  return { settings: admin, users: admin }
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => qc.setQueryData(ME_KEY, user),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logout,
    // Signed out on the client even if the request failed. Clearing `me` first
    // sends RequireAuth to the login screen; then nothing stale stays cached.
    onSettled: () => {
      qc.setQueryData(ME_KEY, null)
      qc.removeQueries({ predicate: (q) => q.queryKey[0] !== ME_KEY[0] })
    },
  })
}
