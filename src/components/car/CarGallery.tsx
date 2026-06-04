import { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import type { ListingImage } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CarGalleryProps {
  images: ListingImage[]
  title: string
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mainLoaded, setMainLoaded] = useState(false)

  if (!images.length) {
    return (
      <div className="aspect-[16/9] rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-lg">No images available</span>
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 group">
        {!mainLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
        <img
          src={images[activeIndex].image_url}
          alt=""
          onLoad={() => setMainLoaded(true)}
          className={cn('w-full h-full object-cover', !mainLoaded && 'hidden')}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white w-6' : 'bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
