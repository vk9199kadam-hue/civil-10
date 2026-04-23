import { useState } from 'react'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/listings'

interface ImageGalleryProps {
  images: MediaItem[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  if (images.length === 0) {
    return (
      <div className={cn('flex h-64 items-center justify-center rounded-xl bg-gray-100 text-gray-400', className)}>
        No images available
      </div>
    )
  }

  const prev = () => setCurrent(c => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === images.length - 1 ? 0 : c + 1))

  return (
    <>
      <div className={cn('relative overflow-hidden rounded-xl bg-gray-100', className)}>
        <div className="relative h-64 sm:h-80 md:h-96">
          <img
            src={images[current].public_url}
            alt={images[current].alt_text || 'Property image'}
            className="h-full w-full object-cover"
          />

          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white">
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white">
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          <button
            onClick={() => setFullscreen(true)}
            className="absolute right-3 top-3 rounded-lg bg-white/80 p-2 shadow-md hover:bg-white"
          >
            <Expand className="h-4 w-4 text-gray-700" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {current + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto p-2 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  i === current ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <img src={img.public_url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black" onClick={() => setFullscreen(false)}>
          <img src={images[current].public_url} alt="" className="max-h-full max-w-full object-contain" />
          <button onClick={() => setFullscreen(false)} className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/40">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/40">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
