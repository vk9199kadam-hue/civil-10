import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, getRelativeTime } from '@/lib/utils'
import type { PropertyListing } from '@/types/listings'

export function AdminListingsPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: listings, isLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      const q = query(collection(db, 'listings'), orderBy('created_at', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as (PropertyListing & { users: { full_name: string; email: string } })[]
    },
  })

  const updateListing = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const docRef = doc(db, 'listings', id)
      await updateDoc(docRef, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
      toast('Listing updated', 'success')
    },
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
      <div className="space-y-3">
        {listings?.map(listing => (
          <div key={listing.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 truncate">{listing.title}</span>
                <Badge variant="custom" className={listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600 border-red-100'}>
                  {listing.status || 'No Status'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{listing.locality}, {listing.city} — {formatPrice(listing.price)}</p>
              <p className="text-xs text-gray-400">By {(listing as unknown as { users?: { full_name: string } }).users?.full_name || 'User'} — {getRelativeTime(listing.created_at)}</p>
            </div>
            <div className="flex gap-2">
              {listing.status === 'draft' && (
                <Button size="sm" onClick={() => updateListing.mutate({ id: listing.id, updates: { status: 'active', published_at: new Date().toISOString() } })}>
                  Approve
                </Button>
              )}
              <Button size="sm" variant={listing.is_featured ? 'secondary' : 'outline'}
                onClick={() => updateListing.mutate({ id: listing.id, updates: { is_featured: !listing.is_featured } })}>
                {listing.is_featured ? 'Unfeature' : 'Feature'}
              </Button>
              {listing.status === 'active' && (
                <Button size="sm" variant="danger" onClick={() => updateListing.mutate({ id: listing.id, updates: { status: 'archived' } })}>
                  Archive
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
