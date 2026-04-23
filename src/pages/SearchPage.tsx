import { PropertyGrid } from '@/components/property/PropertyGrid'
import { SearchFilters } from '@/components/search/SearchFilters'
import { useSearch } from '@/hooks/useSearch'
import { Search } from 'lucide-react'

export function SearchPage() {
  const { filters, listings, isLoading, updateFilters, clearFilters } = useSearch()

  return (
    <div className="container-app py-6">
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {filters.search ? `Results for "${filters.search}"` : 'All Properties'}
            </h1>
            <p className="text-sm text-gray-500">{listings.length} properties found</p>
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Search properties..."
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden w-64 flex-shrink-0 lg:block">
          <SearchFilters filters={filters} onFilterChange={updateFilters} onClear={clearFilters} />
        </div>
        <div className="flex-1">
          <div className="mb-4 lg:hidden">
            <SearchFilters filters={filters} onFilterChange={updateFilters} onClear={clearFilters} />
          </div>
          <PropertyGrid
            listings={listings}
            loading={isLoading}
            emptyTitle="No properties match your filters"
            emptyDescription="Try adjusting your search criteria or removing some filters."
          />
        </div>
      </div>
    </div>
  )
}
