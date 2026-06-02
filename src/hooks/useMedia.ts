import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, addDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { queryKeys } from '@/lib/query-keys'
import { compressImage } from '@/lib/image-utils'
import { uploadToImageKit, deleteFromImageKit } from '@/lib/imagekit'
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
      let processedFile: File | Blob = file
      if (file.type.startsWith('image/') && mediaType === 'image') {
        processedFile = await compressImage(file, 1600, 1)
      }

      // Determine Cloudinary folder
      const folder = listingId
        ? `islampur/listings/${listingId}`
        : projectId
          ? `islampur/projects/${projectId}`
          : 'islampur/misc'

      // Upload to ImageKit
      const uploadResult = await uploadToImageKit(processedFile, folder)

      // Store metadata in Firestore (public_url is now an ImageKit URL)
      const mediaData = {
        listing_id: listingId || null,
        project_id: projectId || null,
        storage_path: uploadResult.public_id,   // ImageKit fileId (used for deletion)
        public_url: uploadResult.public_url,     // ImageKit secure_url
        media_type: mediaType,
        mime_type: `image/${uploadResult.format}`,
        file_size: uploadResult.bytes,
        sort_order: sortOrder,
        is_cover: isCover,
        width: uploadResult.width,
        height: uploadResult.height,
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
      // Notify about ImageKit deletion (client-side signed deletion requires backend)
      deleteFromImageKit(storagePath)

      // Always delete metadata from Firestore
      await deleteDoc(doc(db, 'media', id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
