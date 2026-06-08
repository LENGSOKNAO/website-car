import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { imageUrl } from '@/lib/utils'

export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    api.users()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? []
        setSellers(Array.isArray(raw) ? raw : [])
      })
      .catch(() => {})
  }, [])

  const doubled = [...sellers, ...sellers]

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-14 md:gap-20 items-center"
          animate={paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={paused ? {} : { duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((seller, i) => (
            <Link
              key={`${seller.id}-${i}`}
              to={`/listings?seller_id=${seller.id}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              {seller.avatar_url ? (
                <img
                  src={imageUrl(seller.avatar_url)}
                  alt={seller.full_name}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-sm md:text-base font-semibold text-gray-600">
                    {seller.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs md:text-sm text-gray-500 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                {seller.full_name}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
