import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, LayoutDashboard, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/dashboard/listings/new', icon: PlusCircle, label: 'Post', authRequired: true },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', authRequired: true },
  { to: '/login', icon: User, label: 'Account', authRequired: false, guestOnly: true },
]

export function MobileNav() {
  const location = useLocation()
  const { user } = useAuth()

  const visibleTabs = tabs.filter(tab => {
    if (tab.guestOnly && user) return false
    if (tab.authRequired && !user) return false
    return true
  })

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around">
        {visibleTabs.map(tab => {
          const isActive = tab.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.to)
          const Icon = tab.icon

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors',
                isActive ? 'text-brand-600' : 'text-gray-500'
              )}
            >
              <Icon className={cn('h-5 w-5', tab.label === 'Post' && 'h-6 w-6')} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
