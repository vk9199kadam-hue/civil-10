import { PropertyCard } from './PropertyCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import type { PropertyListing } from '@/types/listings'

interface PropertyGridProps {
  listings: PropertyListing[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function PropertyGrid({ listings, loading, emptyTitle = 'No properties found', emptyDescription }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (listings.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map(listing => (
        <PropertyCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
