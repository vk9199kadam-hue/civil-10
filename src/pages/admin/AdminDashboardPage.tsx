import { useQuery } from '@tanstack/react-query'
import { collection, query, where, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Building2, FolderKanban, Users, MessageSquare } from 'lucide-react'

export function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const listingsRef = collection(db, 'listings')
      const projectsRef = collection(db, 'projects')
      const usersRef = collection(db, 'users')
      const inquiriesQ = query(collection(db, 'inquiries'), where('status', '==', 'new'))

      const [listingsSnap, projectsSnap, usersSnap, inquiriesSnap] = await Promise.all([
        getCountFromServer(listingsRef),
        getCountFromServer(projectsRef),
        getCountFromServer(usersRef),
        getCountFromServer(inquiriesQ)
      ])

      return {
        totalListings: listingsSnap.data().count,
        totalProjects: projectsSnap.data().count,
        totalUsers: usersSnap.data().count,
        newInquiries: inquiriesSnap.data().count,
      }
    },
  })

  const cards = [
    { label: 'Total Listings', value: stats?.totalListings ?? 0, icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'New Inquiries', value: stats?.newInquiries ?? 0, icon: MessageSquare, color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-500">{card.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
