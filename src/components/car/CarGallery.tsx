import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import type { ListingImage } from '@/lib/types'
import { cn, imageUrl } from '@/lib/utils'

interface CarGalleryProps {
  images: ListingImage[]
  title: string
  variant?: 'default' | 'hero'
  interval?: number
}

export default function CarGallery({ images, title, variant = 'default', interval = 4000 }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mainLoaded, setMainLoaded] = useState(false)
  const isHero = variant === 'hero'

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goTo = useCallback((i: number) => {
    setActiveIndex(i)
  }, [])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [images.length, interval, next])

  if (!images.length) {
    const containerClass = isHero
      ? 'w-full h-full bg-gray-100 flex items-center justify-center'
      : 'aspect-[16/9] rounded-xl bg-gray-100 flex items-center justify-center'
    return (
      <div className={containerClass}>
        <span className="text-gray-400 text-lg">No images available</span>
      </div>
    )
  }

  return (
    <div className={isHero ? 'h-full flex flex-col' : ''}>
      <div className={cn(
        'relative overflow-hidden bg-gray-100 group',
        isHero ? 'flex-1 min-h-0' : 'aspect-[16/9] rounded-xl'
      )}>
        {!mainLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
        <img
          src={imageUrl(images[activeIndex].image_url)}
          alt=""
          onLoad={() => setMainLoaded(true)}
          className={cn('w-full h-full object-cover', !mainLoaded && 'hidden')}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => { prev(); setMainLoaded(false) }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity',
                isHero
                  ? 'left-4 w-12 h-12 text-white/80 hover:text-white cursor-pointer hover:bg-white/10'
                  : 'left-3 w-10 h-10 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white shadow-lg'
              )}
            >
              <ChevronLeft className={isHero ? 'w-6 h-6' : 'w-5 h-5'} />
            </button>
            <button
              onClick={() => { next(); setMainLoaded(false) }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity',
                isHero
                  ? 'right-4 w-12 h-12 text-white/80 hover:text-white cursor-pointer hover:bg-white/10'
                  : 'right-3 w-10 h-10 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white shadow-lg'
              )}
            >
              <ChevronRight className={isHero ? 'w-6 h-6' : 'w-5 h-5'} />
            </button>
            <div className={cn(
              'flex gap-1.5',
              isHero ? 'absolute bottom-6 left-1/2 -translate-x-1/2' : 'absolute bottom-3 left-1/2 -translate-x-1/2'
            )}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i); setMainLoaded(false) }}
                  className={cn(
                    'rounded-full transition-all cursor-pointer',
                    i === activeIndex
                      ? isHero ? 'w-8 h-1.5 bg-white' : 'bg-white w-6 h-2'
                      : isHero ? 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60' : 'bg-white/60 w-2 h-2'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && !isHero && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
            >
              <img src={imageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
