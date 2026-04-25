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
      let q = query(collection(db, 'listings'))
      // Note: We remove the strict 'status' == 'active' filter from Firestore 
      // to handle cases where data might be missing the status field (e.g. after migration).
      // We will filter in memory instead.

      if (filters?.category) q = query(q, where('category', '==', filters.category))
      if (filters?.listing_type) q = query(q, where('listing_type', '==', filters.listing_type))
      if (filters?.city) q = query(q, where('city', '==', filters.city))
      if (filters?.locality) q = query(q, where('locality', '==', filters.locality))
      
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
      
      // Filter by status in memory to be more robust
      let filtered = data.filter(l => 
        l.status === 'active' || 
        !l.status || 
        l.status === '' ||
        l.status === 'published'
      )
      if (filters?.price_min) filtered = filtered.filter((l: any) => l.price >= filters.price_min!)
      if (filters?.price_max) filtered = filtered.filter((l: any) => l.price <= filters.price_max!)
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter((l: any) => l.title.toLowerCase().includes(search))
      }

      // Sort manually to avoid Firebase index error
      filtered.sort((a: any, b: any) => {
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeB - timeA;
      })

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
        where('is_featured', '==', true)
      )

      const querySnapshot = await getDocs(q)
      let data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
      
      // If no featured found, try getting any active listings
      if (data.length === 0) {
        const anyQ = query(collection(db, 'listings'))
        const anySnap = await getDocs(anyQ)
        data = anySnap.docs.map(d => ({ id: d.id, ...d.data() }))
      }

      // Filter by status in memory to be more robust
      const filtered = data.filter(l => 
        l.status === 'active' || 
        !l.status || 
        l.status === 'published' || 
        l.status === ''
      )
      
      // Sort: Featured first, then by date
      filtered.sort((a: any, b: any) => {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeB - timeA;
      })

      return filtered.slice(0, 8) as unknown as PropertyListing[]
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
        where('owner_id', '==', user!.uid)
      )

      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      
      // Sort manually to avoid Firebase index error
      data.sort((a: any, b: any) => {
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeB - timeA;
      })

      return data as unknown as PropertyListing[]
    },
    enabled: !!user,
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (formData: ListingFormData) => {
      if (!user?.uid) {
        throw new Error('You must be logged in to post a property.')
      }

      const slug = generateSlug(formData.title, formData.locality)
      const docData = {
        ...formData,
        slug,
        owner_id: user.uid,
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
