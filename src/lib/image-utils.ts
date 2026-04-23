import imageCompression from 'browser-image-compression'

export async function compressImage(
  file: File,
  maxWidthOrHeight: number = 1600,
  maxSizeMB: number = 1,
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp' as const,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch {
    return file
  }
}

export async function compressImageToThumbnail(file: File): Promise<File> {
  return compressImage(file, 300, 0.1)
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  return validTypes.includes(file.type)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
