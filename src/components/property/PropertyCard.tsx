import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { cn, formatPrice, formatArea } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { PropertyListing } from '@/types/listings'

interface PropertyCardProps {
  listing: PropertyListing
  className?: string
}

const categoryColors: Record<string, string> = {
  residential: 'bg-blue-100 text-blue-700',
  commercial: 'bg-purple-100 text-purple-700',
  land: 'bg-amber-100 text-amber-700',
  industrial: 'bg-slate-100 text-slate-700',
  hospitality: 'bg-rose-100 text-rose-700',
}

export function PropertyCard({ listing, className }: PropertyCardProps) {
  const coverImage = listing.media?.find(m => m.is_cover) || listing.media?.[0]

  return (
    <Link to={`/property/${listing.slug}`} className={cn('card group overflow-hidden', className)}>
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage.public_url}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant="custom" className={cn('text-xs', categoryColors[listing.category])}>
            {listing.category}
          </Badge>
          <Badge variant="custom" className="bg-white/90 text-gray-700 text-xs capitalize">
            {listing.listing_type}
          </Badge>
        </div>
        {listing.is_featured && (
          <Badge variant="warning" className="absolute right-3 top-3 text-xs">Featured</Badge>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 text-lg font-bold text-brand-700">
          {formatPrice(listing.price)}
          {listing.is_negotiable && <span className="ml-1.5 text-xs font-normal text-green-600">Negotiable</span>}
        </div>

        <h3 className="mb-1.5 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-brand-600">
          {listing.title}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          {listing.carpet_area && (
            <span className="rounded bg-gray-100 px-2 py-0.5">{formatArea(listing.carpet_area, listing.area_unit)}</span>
          )}
          {listing.category === 'residential' && (listing.category_specs as Record<string, string | number>)?.bedrooms && (
            <span className="rounded bg-gray-100 px-2 py-0.5">{(listing.category_specs as Record<string, string | number>).bedrooms} BHK</span>
          )}
          {listing.rera_number && (
            <span className="rounded bg-green-50 px-2 py-0.5 text-green-700">RERA</span>
          )}
        </div>
      </div>
    </Link>
  )
}
