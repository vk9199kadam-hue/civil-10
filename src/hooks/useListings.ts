import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  addDoc,
  updateDoc,
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { queryKeys } from '@/lib/query-keys'
import { generateSlug } from '@/lib/utils'
import type { PropertyListing, ListingFilters } from '@/types/listings'
import type { ListingFormData } from '@/lib/validations/listing.schema'
import { useAuth } from './useAuth'



export function useListings(filters?: ListingFilters) {
  return useQuery({
    queryKey: queryKeys.listings.list(filters as unknown as Record<string, unknown>),
    queryFn: async () => {
      let q = query(
        collection(db, 'listings'),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
      )

      if (filters?.category) q = query(q, where('category', '==', filters.category))
      if (filters?.listing_type) q = query(q, where('listing_type', '==', filters.listing_type))
      if (filters?.city) q = query(q, where('city', '==', filters.city))
      if (filters?.locality) q = query(q, where('locality', '==', filters.locality))
      
      // Note: Firebase requires composite indexes for multiple filters + orderBy.
      // Search is also limited (prefix only). 
      
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      
      // Local filtering for price and search (to avoid needing complex indexes immediately)
      let filtered = data
      if (filters?.price_min) filtered = filtered.filter((l: any) => l.price >= filters.price_min!)
      if (filters?.price_max) filtered = filtered.filter((l: any) => l.price <= filters.price_max!)
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter((l: any) => l.title.toLowerCase().includes(search))
      }

      return filtered as unknown as PropertyListing[]
    },
  })
}

export function useListing(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.listings.detail(idOrSlug),
    queryFn: async () => {
      // First try by ID
      const docRef = doc(db, 'listings', idOrSlug)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as PropertyListing
      }

      // If not found, search by slug
      const q = query(collection(db, 'listings'), where('slug', '==', idOrSlug), limit(1))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) throw new Error('Listing not found')
      
      const d = querySnapshot.docs[0]
      return { id: d.id, ...d.data() } as unknown as PropertyListing
    },
    enabled: !!idOrSlug,
  })
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: queryKeys.listings.featured,
    queryFn: async () => {
      const q = query(
        collection(db, 'listings'),
        where('status', '==', 'active'),
        where('is_featured', '==', true),
        orderBy('created_at', 'desc'),
        limit(8)
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as PropertyListing[]
    },
  })
}

export function useMyListings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.listings.byOwner(user?.uid ?? ''),
    queryFn: async () => {
      const q = query(
        collection(db, 'listings'),
        where('owner_id', '==', user!.uid),
        orderBy('created_at', 'desc')
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as PropertyListing[]
    },
    enabled: !!user,
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (formData: ListingFormData) => {
      const slug = generateSlug(formData.title, formData.locality)
      const docData = {
        ...formData,
        slug,
        owner_id: user!.uid,
        view_count: 0,
        status: 'active',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'listings'), docData)
      return { id: docRef.id, ...docData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}

export function useUpdateListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<ListingFormData> & { id: string }) => {
      const docRef = doc(db, 'listings', id)
      await updateDoc(docRef, { 
        ...data, 
        updated_at: serverTimestamp() 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, 'listings', id)
      await updateDoc(docRef, { 
        status: 'archived',
        updated_at: serverTimestamp()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
  })
}
