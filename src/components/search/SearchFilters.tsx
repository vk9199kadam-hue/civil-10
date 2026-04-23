import { PROPERTY_CATEGORIES, LISTING_TYPES, ISLAMPUR_LOCALITIES } from '@/lib/constants'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ListingFilters } from '@/types/listings'

interface SearchFiltersProps {
  filters: ListingFilters
  onFilterChange: (filters: Partial<ListingFilters>) => void
  onClear: () => void
}

export function SearchFilters({ filters, onFilterChange, onClear }: SearchFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = [filters.category, filters.listing_type, filters.locality, filters.price_min, filters.price_max]
    .filter(Boolean).length

  const filterContent = (
    <div className="space-y-4">
      <Select
        label="Category"
        options={PROPERTY_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
        placeholder="All Categories"
        value={filters.category || ''}
        onChange={(e) => onFilterChange({ category: e.target.value as ListingFilters['category'] || undefined })}
      />
      <Select
        label="Listing Type"
        options={LISTING_TYPES.map(t => ({ value: t.value, label: t.label }))}
        placeholder="Buy / Rent / Lease"
        value={filters.listing_type || ''}
        onChange={(e) => onFilterChange({ listing_type: e.target.value as ListingFilters['listing_type'] || undefined })}
      />
      <Select
        label="Locality"
        options={ISLAMPUR_LOCALITIES.map(l => ({ value: l, label: l }))}
        placeholder="All Localities"
        value={filters.locality || ''}
        onChange={(e) => onFilterChange({ locality: e.target.value || undefined })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min Price"
          type="number"
          prefix="₹"
          placeholder="Min"
          value={filters.price_min ?? ''}
          onChange={(e) => onFilterChange({ price_min: e.target.value ? Number(e.target.value) : undefined })}
        />
        <Input
          label="Max Price"
          type="number"
          prefix="₹"
          placeholder="Max"
          value={filters.price_max ?? ''}
          onChange={(e) => onFilterChange({ price_max: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>
      <Select
        label="Sort By"
        options={[
          { value: 'newest', label: 'Newest First' },
          { value: 'price_asc', label: 'Price: Low to High' },
          { value: 'price_desc', label: 'Price: High to Low' },
          { value: 'most_viewed', label: 'Most Viewed' },
        ]}
        value={filters.sort_by || 'newest'}
        onChange={(e) => onFilterChange({ sort_by: e.target.value as ListingFilters['sort_by'] })}
      />
      {activeCount > 0 && (
        <Button variant="ghost" className="w-full text-red-600" onClick={onClear}>
          <X className="h-4 w-4" /> Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20 rounded-xl border bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Filters</h3>
          {filterContent}
        </div>
      </div>

      {/* Mobile filter button + sheet */}
      <div className="lg:hidden">
        <Button
          variant="secondary"
          onClick={() => setMobileOpen(true)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
              {activeCount}
            </span>
          )}
        </Button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className={cn(
              'fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6',
              'animate-in slide-in-from-bottom'
            )}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
              <Button className="mt-4 w-full" onClick={() => setMobileOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
