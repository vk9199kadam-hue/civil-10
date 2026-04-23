import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isValidImageType, formatFileSize } from '@/lib/image-utils'
import { Button } from '@/components/ui/Button'

interface ImageUploaderProps {
  images: File[]
  onChange: (files: File[]) => void
  maxImages?: number
}

export function ImageUploader({ images, onChange, maxImages = 20 }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList).filter(f => isValidImageType(f))
    const combined = [...images, ...newFiles].slice(0, maxImages)
    onChange(combined)
  }, [images, onChange, maxImages])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP. Max {maxImages} images. Auto-compressed to WebP.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{images.length} / {maxImages} images</span>
            {images.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => onChange([])}>Clear all</Button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {images.map((file, index) => (
              <div key={`${file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                    className="rounded-full bg-white/90 p-1.5 text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 px-2 py-1">
                  <p className="truncate text-[10px] text-white">{formatFileSize(file.size)}</p>
                </div>
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-medium text-white">Cover</span>
                )}
              </div>
            ))}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
              >
                <ImageIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
