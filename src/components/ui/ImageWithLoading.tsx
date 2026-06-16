import { useState, useRef, useEffect } from 'react'
import { ImageOff, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageWithLoadingProps {
  src: string
  alt?: string
  className?: string
  width?: number | string
  height?: number | string
  fill?: boolean
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export default function ImageWithLoading({
  src,
  alt = '',
  className = '',
  width,
  height,
  fill = false,
  priority = false,
  onLoad,
  onError,
}: ImageWithLoadingProps) {
  const isPlaceholder = src.startsWith('data:image/svg+xml')
  const [isLoaded, setIsLoaded] = useState(isPlaceholder)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const prevSrc = useRef(src)

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (src !== prevSrc.current) {
      setIsLoaded(src.startsWith('data:image/svg+xml'))
      setHasError(false)
    }
    prevSrc.current = src
  }, [src])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={
        fill
          ? { width: '100%', height: '100%' }
          : { width, height }
      }
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 overflow-hidden flex items-center justify-center z-10">
          <Loader className="w-8 h-8 text-gray-400 animate-spin" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn('block w-full h-full object-cover', !isLoaded && 'opacity-0')}
        style={{ transition: 'opacity 400ms ease-in-out' }}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={priority ? 'eager' : 'lazy'}
      />

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gray-50 text-gray-400">
          <ImageOff className="w-6 h-6" />
          <span className="text-[11px] font-medium">Failed to load</span>
        </div>
      )}
    </div>
  )
}
