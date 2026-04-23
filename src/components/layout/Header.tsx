import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { APP_NAME } from '@/lib/constants'
import { Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/search?category=residential', label: 'Residential' },
    { to: '/search?category=commercial', label: 'Commercial' },
    { to: '/search?category=land', label: 'Land & Plots' },
    { to: '/projects', label: 'Projects' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
              IP
            </div>
            <span className="hidden text-lg font-bold text-gray-900 sm:block">{APP_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname + location.search === link.to
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/search" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden">
            <Search className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {(profile?.role === 'owner' || profile?.role === 'agent' || profile?.role === 'admin') && (
                <Link to="/dashboard/listings/new">
                  <Button size="sm">+ Add Property</Button>
                </Link>
              )}
              <Link to="/dashboard" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <button onClick={() => signOut()} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={() => { signOut(); setMenuOpen(false) }} className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 text-left">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <User className="h-4 w-4" /> Login
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full mt-1">Sign Up Free</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
