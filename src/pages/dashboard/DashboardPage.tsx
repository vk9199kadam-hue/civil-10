import { useAuth } from '@/hooks/useAuth'
import { useMyListings } from '@/hooks/useListings'
import { useMyProjects } from '@/hooks/useProjects'
import { Building2, FolderKanban, MessageSquare, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { profile } = useAuth()
  const { data: listings } = useMyListings()
  const { data: projects } = useMyProjects()

  const stats = [
    { label: 'My Listings', value: listings?.length ?? 0, icon: Building2, to: '/dashboard/listings', color: 'bg-blue-100 text-blue-600' },
    { label: 'My Projects', value: projects?.length ?? 0, icon: FolderKanban, to: '/dashboard/projects', color: 'bg-purple-100 text-purple-600' },
    { label: 'Active', value: listings?.filter(l => l.status === 'active').length ?? 0, icon: TrendingUp, to: '/dashboard/listings', color: 'bg-green-100 text-green-600' },
    { label: 'Inquiries', value: '—', icon: MessageSquare, to: '/dashboard/inquiries', color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.full_name || 'User'}</h1>
        <p className="text-sm text-gray-500 capitalize">{profile?.role} account</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} to={stat.to} className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/dashboard/listings/new" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Building2 className="h-5 w-5 text-brand-600" /> Post a New Property
            </Link>
            <Link to="/dashboard/projects/new" className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FolderKanban className="h-5 w-5 text-purple-600" /> Create a New Project
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Listings</h2>
          {listings && listings.length > 0 ? (
            <div className="space-y-3">
              {listings.slice(0, 5).map(l => (
                <Link key={l.id} to={`/dashboard/listings/${l.id}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 line-clamp-1">{l.title}</div>
                    <div className="text-gray-500">{l.locality}</div>
                  </div>
                  <span className={`badge text-xs ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {l.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No listings yet. Post your first property!</p>
          )}
        </div>
      </div>
    </div>
  )
}
