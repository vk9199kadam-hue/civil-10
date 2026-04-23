import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, addDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { queryKeys } from '@/lib/query-keys'
import { compressImage } from '@/lib/image-utils'
import type { MediaItem } from '@/types/listings'

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      listingId,
      projectId,
      mediaType = 'image',
      sortOrder = 0,
      isCover = false,
    }: {
      file: File
      listingId?: string
      projectId?: string
      mediaType?: MediaItem['media_type']
      sortOrder?: number
      isCover?: boolean
    }) => {
      let processedFile = file as Blob
      if (file.type.startsWith('image/') && mediaType === 'image') {
        processedFile = await compressImage(file, 1600, 1)
      }

      const folder = listingId ? 'listings' : projectId ? 'projects' : 'misc'
      const id = listingId || projectId || 'misc'
      const fileName = `${folder}/${id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, fileName)
      const uploadResult = await uploadBytes(storageRef, processedFile, {
        contentType: 'image/webp',
      })

      const publicUrl = await getDownloadURL(uploadResult.ref)

      // Add to Firestore media collection
      const mediaData = {
        listing_id: listingId || null,
        project_id: projectId || null,
        storage_path: fileName,
        public_url: publicUrl,
        media_type: mediaType,
        mime_type: 'image/webp',
        file_size: processedFile.size,
        sort_order: sortOrder,
        is_cover: isCover,
        created_at: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'media'), mediaData)
      
      return { id: docRef.id, ...mediaData } as unknown as MediaItem
    },
    onSuccess: (_data, vars) => {
      if (vars.listingId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.media.byListing(vars.listingId) })
      }
      if (vars.projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.media.byProject(vars.projectId) })
      }
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      // Delete from Firebase Storage
      const storageRef = ref(storage, storagePath)
      await deleteObject(storageRef)
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'media', id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
