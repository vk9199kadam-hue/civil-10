import { Link } from 'react-router-dom'
import { useMyListings, useDeleteListing } from '@/hooks/useListings'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, getRelativeTime } from '@/lib/utils'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  sold: 'bg-red-100 text-red-700',
  rented: 'bg-blue-100 text-blue-700',
  expired: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-500',
}

export function MyListingsPage() {
  const { data: listings, isLoading } = useMyListings()
  const deleteListing = useDeleteListing()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this listing?')) return
    try {
      await deleteListing.mutateAsync(id)
      toast('Listing archived', 'success')
    } catch {
      toast('Failed to archive listing', 'error')
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500">{listings?.length || 0} properties</p>
        </div>
        <Link to="/dashboard/listings/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add Property</Button>
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Post your first property to start getting inquiries."
          action={<Link to="/dashboard/listings/new"><Button>Post Property</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {listings.map(listing => {
            const cover = listing.media?.find(m => m.is_cover) || listing.media?.[0]
            return (
              <div key={listing.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {cover ? (
                    <img src={cover.public_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                    <Badge variant="custom" className={statusColors[listing.status]}>{listing.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{listing.locality}, {listing.city}</p>
                  <div className="mt-1 flex items-center gap-3 text-sm">
                    <span className="font-bold text-brand-700">{formatPrice(listing.price)}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500 capitalize">{listing.category}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-400">{getRelativeTime(listing.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/property/${listing.slug}`}>
                    <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
                  </Link>
                  <Link to={`/dashboard/listings/${listing.id}/edit`}>
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(listing.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
