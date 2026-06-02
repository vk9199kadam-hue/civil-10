import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

/**
 * AdminGuard — Wraps all /admin/* routes.
 * - Not logged in  → redirect to /admin-login
 * - Logged in but not admin → redirect to /
 * - Admin → render children
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
