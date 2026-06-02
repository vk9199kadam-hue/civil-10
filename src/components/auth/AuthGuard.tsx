import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

/**
 * AuthGuard — Wraps all /dashboard/* routes.
 * - Not logged in → redirect to /login
 * - Logged in → render children
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
