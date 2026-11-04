import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ConfirmProvider } from '@/components/confirm/ConfirmProvider'
import { ToastProvider } from '@/components/toast/ToastProvider'
import { ME_KEY } from '@/features/auth/hooks/useAuth'
import { ApiError } from '@/lib/http'

// A 401 anywhere means the session ended (expired, or signed out in another
// tab): forget the user, and RequireAuth sends them to the login screen.
const onError = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) queryClient.setQueryData(ME_KEY, null)
}

const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({ onError }),
  mutationCache: new MutationCache({ onError }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Client errors (404, 403…) will not change on retry; network blips may.
      retry: (count, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && count < 2,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
