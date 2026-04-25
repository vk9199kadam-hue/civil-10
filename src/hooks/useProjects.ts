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
import type { Project } from '@/types/projects'
import type { ProjectFormData } from '@/lib/validations/project.schema'
import { useAuth } from './useAuth'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: async () => {
      const q = query(collection(db, 'projects'))

      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Project[]
      
      return data.sort((a, b) => {
        const timeA = (a as any).created_at?.toMillis?.() || 0;
        const timeB = (b as any).created_at?.toMillis?.() || 0;
        return timeB - timeA;
      })
    },
  })
}

export function useProject(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(idOrSlug),
    queryFn: async () => {
      // Try by ID
      const docRef = doc(db, 'projects', idOrSlug)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as Project
      }

      // Try by slug
      const q = query(collection(db, 'projects'), where('slug', '==', idOrSlug), limit(1))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) throw new Error('Project not found')
      
      const d = querySnapshot.docs[0]
      return { id: d.id, ...d.data() } as unknown as Project
    },
    enabled: !!idOrSlug,
  })
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.projects.featured,
    queryFn: async () => {
      const q = query(
        collection(db, 'projects'),
        where('is_featured', '==', true)
      )

      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Project[]
      
      data.sort((a, b) => {
        const timeA = (a as any).created_at?.toMillis?.() || 0;
        const timeB = (b as any).created_at?.toMillis?.() || 0;
        return timeB - timeA;
      })

      return data.slice(0, 6)
    },
  })
}

export function useMyProjects() {
  const { user, profile } = useAuth()
  return useQuery({
    queryKey: [...queryKeys.projects.byOwner(user?.uid ?? ''), profile?.role],
    queryFn: async () => {
      // If admin, show everything
      const q = profile?.role === 'admin'
        ? query(collection(db, 'projects'))
        : query(
            collection(db, 'projects'),
            where('owner_id', '==', user!.uid)
          )

      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Project[]
      
      // Sort manually to avoid Firebase index error
      return data.sort((a, b) => {
        const timeA = (a as any).created_at?.toMillis?.() || 0;
        const timeB = (b as any).created_at?.toMillis?.() || 0;
        return timeB - timeA;
      })
    },
    enabled: !!user,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (formData: ProjectFormData) => {
      if (!user?.uid) {
        throw new Error('You must be logged in to create a project.')
      }

      const slug = generateSlug(formData.name, formData.locality)
      const docData = {
        ...formData,
        slug,
        owner_id: user.uid,
        amenities: formData.amenities,
        specifications: {},
        status: 'upcoming',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'projects'), docData)
      return { id: docRef.id, ...docData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<ProjectFormData> & { id: string }) => {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, { 
        ...data, 
        updated_at: serverTimestamp() 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}
