import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc,
  addDoc,
  updateDoc,
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { queryKeys } from '@/lib/query-keys'
import type { Inquiry } from '@/types/inquiries'
import type { InquiryFormData } from '@/lib/validations/inquiry.schema'

export function useInquiries(filters?: { listing_id?: string; project_id?: string }) {
  return useQuery({
    queryKey: queryKeys.inquiries.list(filters),
    queryFn: async () => {
      let q = query(
        collection(db, 'inquiries'),
        orderBy('created_at', 'desc')
      )

      if (filters?.listing_id) q = query(q, where('listing_id', '==', filters.listing_id))
      if (filters?.project_id) q = query(q, where('project_id', '==', filters.project_id))

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Inquiry[]
    },
  })
}

export function useCreateInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: InquiryFormData & {
      listing_id?: string
      project_id?: string
      unit_id?: string
      source?: 'website' | 'whatsapp' | 'call'
    }) => {
      const docData = {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        listing_id: data.listing_id || null,
        project_id: data.project_id || null,
        unit_id: data.unit_id || null,
        source: data.source || 'website',
        status: 'new',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }

      await addDoc(collection(db, 'inquiries'), docData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all })
    },
  })
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Inquiry['status'] }) => {
      const docRef = doc(db, 'inquiries', id)
      await updateDoc(docRef, { 
        status, 
        updated_at: serverTimestamp() 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all })
    },
  })
}
