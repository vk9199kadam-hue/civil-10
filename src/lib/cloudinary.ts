/**
 * Cloudinary image upload utility
 *
 * All images are uploaded to Cloudinary (not Firebase Storage).
 * Metadata (URLs) are still stored in Firebase Firestore.
 *
 * Setup:
 *  1. Sign up at https://cloudinary.com (free)
 *  2. Copy your Cloud Name from the dashboard
 *  3. Create an unsigned Upload Preset under Settings → Upload
 *  4. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export interface CloudinaryUploadResult {
  public_id: string
  public_url: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * @param file     - The image File to upload
 * @param folder   - Cloudinary folder path, e.g. "listings/abc123"
 */
export async function uploadToCloudinary(
  file: File | Blob,
  folder: string,
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || CLOUD_NAME === 'your_cloud_name') {
    throw new Error(
      'Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env.local file.',
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Cloudinary upload failed: ${errorData?.error?.message ?? response.statusText}`,
    )
  }

  const data = await response.json()

  return {
    public_id: data.public_id,
    public_url: data.secure_url,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  }
}

/**
 * Delete an image from Cloudinary by its public_id.
 * NOTE: Client-side deletion requires a signed request which needs a backend/server function.
 * For now this logs a warning — use Cloudinary dashboard or a Cloud Function to delete.
 */
export function deleteFromCloudinary(publicId: string): void {
  // Cloudinary client-side deletion requires a signed request.
  // This is intentionally a no-op here; the image metadata will be removed from Firestore.
  // To enable deletion, set up a Firebase Cloud Function or server endpoint that signs the request.
  console.warn(
    `[Cloudinary] Image deletion from client is not supported without a backend. ` +
      `Public ID "${publicId}" should be deleted via Cloudinary Dashboard or a server function.`,
  )
}

/**
 * Build a Cloudinary optimised URL from a public_id with transformations.
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number | 'auto' } = {},
): string {
  if (!CLOUD_NAME || CLOUD_NAME === 'your_cloud_name') return ''

  const { width, height, quality = 'auto' } = options
  const transforms = [
    'f_auto',
    `q_${quality}`,
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    'c_limit',
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}
