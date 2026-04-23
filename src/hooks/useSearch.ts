import { useSearchParams } from 'react-router-dom'
import { useListings } from './useListings'
import type { ListingFilters, PropertyCategory, ListingType } from '@/types/listings'

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: ListingFilters = {
    search: searchParams.get('q') || undefined,
    category: (searchParams.get('category') as PropertyCategory) || undefined,
    listing_type: (searchParams.get('type') as ListingType) || undefined,
    city: searchParams.get('city') || undefined,
    locality: searchParams.get('locality') || undefined,
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    sort_by: (searchParams.get('sort') as ListingFilters['sort_by']) || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  }

  const { data: listings, isLoading, error } = useListings(filters)

  const updateFilters = (newFilters: Partial<ListingFilters>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key === 'search' ? 'q' : key === 'listing_type' ? 'type' : key === 'sort_by' ? 'sort' : key, String(value))
      } else {
        params.delete(key === 'search' ? 'q' : key === 'listing_type' ? 'type' : key === 'sort_by' ? 'sort' : key)
      }
    })

    if (newFilters.page === undefined) params.delete('page')
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})

  return { filters, listings: listings ?? [], isLoading, error, updateFilters, clearFilters }
}
