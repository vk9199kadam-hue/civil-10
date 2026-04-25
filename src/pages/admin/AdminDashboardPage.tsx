import { useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, query, where, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Building2, FolderKanban, Users, MessageSquare, Database } from 'lucide-react'
import { seedDatabase } from '@/lib/seed'
import { useState } from 'react'

export function AdminDashboardPage() {
  const queryClient = useQueryClient()
  const [isSeeding, setIsSeeding] = useState(false)

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

  const handleSeed = async () => {
    if (!confirm('This will add test property data to your Firebase. Continue?')) return
    setIsSeeding(true)
    try {
      await seedDatabase()
      alert('Database seeded successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    } catch (err) {
      alert('Seeding failed. Check console.')
    } finally {
      setIsSeeding(false)
    }
  }

  const cards = [
    { label: 'Total Listings', value: stats?.totalListings ?? 0, icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'New Inquiries', value: stats?.newInquiries ?? 0, icon: MessageSquare, color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard Overview</h1>
        <button 
          onClick={handleSeed}
          disabled={isSeeding}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          <Database className="h-4 w-4" />
          {isSeeding ? 'Seeding Data...' : 'Seed Test Data'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card flex items-center gap-4 p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
      
      <div className="glass p-6 rounded-2xl border border-white/20">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your Real Estate Portal</h2>
        <p className="text-gray-600">Your backend is now fully connected to Firebase. Use the button above to populate your database with initial listings if it's currently empty.</p>
      </div>
    </div>
  )
}

