import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Gauge, Heart, Car, Loader } from 'lucide-react'
import type { CarListing } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface CarCardProps {
  listing: CarListing
  layout?: 'grid' | 'list'
  index?: number
  isSaved?: boolean
  onSave?: (id: string) => void
}

export default function CarCard({ listing, layout = 'grid', index = 0, isSaved, onSave }: CarCardProps) {
  const img = listing.primary_image || listing.images?.[0]
  const [imgLoaded, setImgLoaded] = useState(false)
  const isNew = listing.condition?.toLowerCase() === 'new'
  const isCertified = listing.condition?.toLowerCase() === 'certified pre-owned'
  const discount = listing.original_price ? Math.round((1 - listing.price / listing.original_price) * 100) : 0

  const Wrap = layout === 'grid' ? motion.div : motion.div
  const delay = index * 0.04

  return (
    <Wrap
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'group rounded-2xl border bg-dark-975 overflow-hidden card-hover-dark',
        layout === 'grid' ? 'border-dark-800' : 'border-dark-800'
      )}
    >
      <Link to={`/listings/${listing.id}`} className={layout === 'list' ? 'flex' : 'block'}>
        {/* Image */}
        <div className={cn('relative overflow-hidden bg-dark-900', layout === 'grid' ? 'aspect-[4/3]' : 'w-72 h-full min-h-[180px]')}>
          {img ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
                  <Loader className="w-6 h-6 text-dark-500 animate-spin" />
                </div>
              )}
              <img src={img.image_url} alt="" onLoad={() => setImgLoaded(true)} className={cn('w-full h-full object-cover group-hover:scale-105 transition-transform duration-700', !imgLoaded && 'hidden')} />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Car className="w-12 h-12 text-dark-700" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-975 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && <Badge variant="success">New</Badge>}
            {isCertified && <Badge variant="info">Certified</Badge>}
            {listing.condition === 'used' && <Badge>Used</Badge>}
            {discount > 0 && <Badge variant="premium">-{discount}%</Badge>}
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="text-lg font-bold text-white">{formatPrice(listing.price)}</span>
          </div>
          {onSave && (
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(listing.id) }}
              className={cn('absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all', isSaved ? 'bg-red-500/20 text-red-400' : 'bg-dark-975/60 text-dark-400 hover:text-white')}>
              <Heart className={cn('w-4 h-4', isSaved && 'fill-red-400')} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className={layout === 'grid' ? 'p-4' : 'p-5 flex-1 flex flex-col justify-center'}>
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {listing.year} {listing.make?.name} {listing.model?.name}
          </h3>
          {listing.location && (
            <p className="flex items-center gap-1 text-xs text-dark-500 mt-1"><MapPin className="w-3 h-3" /> {listing.location}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {listing.mileage && (
              <span className="text-xs text-dark-400 flex items-center gap-1"><Gauge className="w-3 h-3" />{listing.mileage.toLocaleString()} mi</span>
            )}
            {listing.fuel_type && <span className="text-xs text-dark-400">{listing.fuel_type}</span>}
            {listing.transmission && <span className="text-xs text-dark-400">{listing.transmission}</span>}
          </div>
        </div>
      </Link>
    </Wrap>
  )
}
