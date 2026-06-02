import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

/**
 * AdminGuard — Wraps all /admin/* routes.
 * - Loading auth/profile → show spinner
 * - Not logged in         → redirect to /admin-login
 * - Logged in, not admin  → redirect to /
 * - Admin                 → render children
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  // Wait for both Firebase auth AND Firestore profile to resolve
  if (loading || (user && profile === null)) {
    return <PageLoader />
  }

  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/admin-login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
