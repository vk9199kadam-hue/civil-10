import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building2, FolderKanban, MessageSquare,
  User, Shield, Menu, LogOut, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const sidebarLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/dashboard/listings', icon: Building2, label: 'My Listings', exact: false },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'My Projects', exact: false },
  { to: '/dashboard/inquiries', icon: MessageSquare, label: 'Inquiries', exact: false },
  { to: '/dashboard/profile', icon: User, label: 'Profile', exact: false },
]

const adminLinks = [
  { to: '/admin', icon: Shield, label: 'Admin Panel', exact: true },
  { to: '/admin/listings', icon: Building2, label: 'All Listings', exact: false },
  { to: '/admin/users', icon: User, label: 'Users', exact: false },
  { to: '/admin/inquiries', icon: MessageSquare, label: 'All Inquiries', exact: false },
]

export function DashboardLayout() {
  const { user, profile, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  if (loading) return <PageLoader />

  const isAdmin = profile?.role === 'admin'
  const links = isAdmin
    ? [...sidebarLinks, { to: '__divider__', icon: ChevronRight, label: '---', exact: false }, ...adminLinks]
    : sidebarLinks

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform lg:static lg:translate-x-0 flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">IC</div>
            <span className="font-bold text-gray-900">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {links.map((link) => {
            if (link.label === '---') {
              return (
                <div key="divider" className="py-2">
                  <div className="flex items-center gap-2 px-3 mb-1">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Admin</span>
                    <hr className="flex-1 border-gray-200" />
                  </div>
                </div>
              )
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
                <Icon className="h-5 w-5 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User info + Logout */}
        <div className="border-t p-4 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-xs shrink-0">
              {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            {isAdmin && (
              <span className="ml-auto shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                Admin
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6 lg:hidden shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-900">
            {isAdmin ? 'Admin Panel' : 'Dashboard'}
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
