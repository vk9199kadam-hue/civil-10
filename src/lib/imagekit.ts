/**
 * ImageKit image upload utility
 *
 * All images are uploaded to ImageKit (replacing Cloudinary).
 * Signature generation is done directly in the browser using the Web Crypto API.
 */

const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT
const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY

export interface ImageKitUploadResult {
  public_id: string
  public_url: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Helper to generate HMAC-SHA1 hex signature on the client side
 */
async function generateHMAC(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const messageData = encoder.encode(message)

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )

  const signatureBuffer = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  )

  return Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Upload a file to ImageKit using client-side generated credentials
 * @param file     - The image File/Blob to upload
 * @param folder   - Destination folder path in ImageKit, e.g. "listings/abc123"
 */
export async function uploadToImageKit(
  file: File | Blob,
  folder: string,
): Promise<ImageKitUploadResult> {
  if (!URL_ENDPOINT || !PUBLIC_KEY || !PRIVATE_KEY) {
    throw new Error(
      'ImageKit is not fully configured. Please set VITE_IMAGEKIT_URL_ENDPOINT, VITE_IMAGEKIT_PUBLIC_KEY, and VITE_IMAGEKIT_PRIVATE_KEY in your .env.local file.',
    )
  }

  // 1. Generate auth parameters
  const token = typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36)
  
  const expire = Math.floor(Date.now() / 1000) + 1800 // 30 minutes validity
  const signature = await generateHMAC(token + expire, PRIVATE_KEY)

  // 2. Build file name
  const fileName = file instanceof File ? file.name : `upload-${Date.now()}.webp`

  // 3. Build FormData
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', fileName)
  formData.append('publicKey', PUBLIC_KEY)
  formData.append('signature', signature)
  formData.append('token', token)
  formData.append('expire', expire.toString())
  formData.append('folder', folder)

  // 4. Send request to ImageKit Upload Endpoint
  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `ImageKit upload failed: ${errorData?.message ?? response.statusText}`,
    )
  }

  const data = await response.json()

  return {
    public_id: data.fileId,
    public_url: data.url,
    width: data.width || 0,
    height: data.height || 0,
    format: data.name.split('.').pop() || 'webp',
    bytes: data.size || 0,
  }
}

/**
 * Delete an image from ImageKit by its fileId.
 * NOTE: ImageKit client-side deletion requires a signed DELETE request.
 * For parity with Cloudinary, this logs a warning placeholder.
 */
export function deleteFromImageKit(fileId: string): void {
  console.warn(
    `[ImageKit] Image deletion from client is not supported without a backend. ` +
      `File ID "${fileId}" should be deleted via ImageKit Dashboard or a server function.`,
  )
}
