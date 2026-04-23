import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building2, FolderKanban, MessageSquare,
  User, Shield, ChevronLeft, Menu
} from 'lucide-react'
import { useState } from 'react'

const sidebarLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/dashboard/listings', icon: Building2, label: 'My Listings' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'My Projects' },
  { to: '/dashboard/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

const adminLinks = [
  { to: '/admin', icon: Shield, label: 'Admin Panel', exact: true },
  { to: '/admin/listings', icon: Building2, label: 'All Listings' },
  { to: '/admin/users', icon: User, label: 'Users' },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'All Inquiries' },
]

export function DashboardLayout() {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return <PageLoader />
  // TEMPORARY: Bypass auth for UI preview
  // if (!user) return <Navigate to="/login" replace />

  const links = true // profile?.role === 'admin'
    ? [...sidebarLinks, { to: '', icon: ChevronLeft, label: '---', exact: false }, ...adminLinks]
    : sidebarLinks

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">IP</div>
            <span className="font-bold text-gray-900">Dashboard</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => {
            if (link.label === '---') {
              return <hr key="divider" className="my-3" />
            }
            const Icon = link.icon
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to) && link.to !== '/dashboard'
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-900">Dashboard</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
