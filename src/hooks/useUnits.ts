import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { 
  collection, 
  query, 
  onSnapshot, 
  getDocs, 
  doc, 
  updateDoc, 
  writeBatch,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { queryKeys } from '@/lib/query-keys'
import type { Unit, InventorySummary } from '@/types/units'
import type { UnitUpdateFormData } from '@/lib/validations/unit.schema'

// Strategy: Units are a subcollection under the project
// Path: projects/{projectId}/units

export function useUnits(projectId: string) {
  return useQuery({
    queryKey: queryKeys.units.byProject(projectId),
    queryFn: async () => {
      const q = query(
        collection(db, 'projects', projectId, 'units'),
        orderBy('floor_number', 'desc'),
        orderBy('grid_col', 'asc')
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Unit[]
    },
    enabled: !!projectId,
  })
}

export function useRealtimeUnits(projectId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!projectId) return

    const q = query(collection(db, 'projects', projectId, 'units'))
    
    // onSnapshot is perfect for realtime inventory updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const unitData = { id: change.doc.id, ...change.doc.data() } as unknown as Unit
        
        queryClient.setQueryData<Unit[]>(
          queryKeys.units.byProject(projectId),
          (old) => {
            if (!old) return [unitData]
            
            if (change.type === 'added') {
               // Only add if not already present
               return old.some(u => u.id === unitData.id) ? old : [...old, unitData]
            }
            if (change.type === 'modified') {
              return old.map(u => u.id === unitData.id ? unitData : u)
            }
            if (change.type === 'removed') {
              return old.filter(u => u.id !== unitData.id)
            }
            return old
          }
        )
      })
    })

    return () => unsubscribe()
  }, [projectId, queryClient])
}

export function useUpdateUnitStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ unitId, projectId, ...data }: UnitUpdateFormData & { unitId: string; projectId: string }) => {
      const docRef = doc(db, 'projects', projectId, 'units', unitId)
      await updateDoc(docRef, {
        ...data,
        status_changed_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
      return { unitId, projectId }
    },
    onMutate: async ({ unitId, projectId, ...data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.units.byProject(projectId) })
      const previous = queryClient.getQueryData<Unit[]>(queryKeys.units.byProject(projectId))

      queryClient.setQueryData<Unit[]>(
        queryKeys.units.byProject(projectId),
        (old) => old?.map(u => u.id === unitId ? { ...u, ...data } : u)
      )

      return { previous, projectId }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.units.byProject(context.projectId),
          context.previous
        )
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.byProject(vars.projectId) })
    },
  })
}

export function useBulkCreateUnits() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (units: Array<{
      project_id: string
      unit_number: string
      floor_number: number
      block_or_wing: string
      unit_type: string
      grid_row: number
      grid_col: number
    }>) => {
      if (units.length === 0) return
      
      const projectId = units[0].project_id
      const batch = writeBatch(db)
      
      units.forEach(unit => {
        const docRef = doc(collection(db, 'projects', projectId, 'units'))
        batch.set(docRef, {
          ...unit,
          status: 'available',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        })
      })

      await batch.commit()
    },
    onSuccess: (_data, vars) => {
      if (vars.length > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.units.byProject(vars[0].project_id) })
      }
    },
  })
}

export function useInventorySummary(units: Unit[]): InventorySummary {
  return {
    available: units.filter(u => u.status === 'available').length,
    booked: units.filter(u => u.status === 'booked').length,
    sold: units.filter(u => u.status === 'sold').length,
    blocked: units.filter(u => u.status === 'blocked').length,
    total: units.length,
  }
}
