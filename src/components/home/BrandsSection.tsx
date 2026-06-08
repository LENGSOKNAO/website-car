import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store } from 'lucide-react'
import { api } from '@/lib/api'
import { imageUrl } from '@/lib/utils'

export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    api.sliders()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? []
        const list = Array.isArray(raw) ? raw : []
        const map = new Map<string, any>()
        for (const s of list) {
          const u = s.user
          if (u?.id && !map.has(u.id)) {
            map.set(u.id, {
              ...u,
              full_name: u.full_name ?? u.name,
              avatar_url: u.avatar_url ?? u.avatar ?? u.image,
            })
          }
        }
        if (map.size > 0) { setSellers(Array.from(map.values())); return }
      })
      .catch(() => {})
  }, [])

  if (sellers.length === 0) return null

  const doubled = [...sellers, ...sellers]

  return (
    <section className="py-20 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Our Network</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Trusted Sellers</h2>
        </motion.div>
      </div>
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-14 md:gap-20 items-center"
          animate={paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={paused ? {} : { duration: 50, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((seller, i) => {
            const name = seller.dealer_name || seller.full_name || seller.name || 'Seller'
            return (
              <Link
                key={`${seller.id}-${i}`}
                to={`/listings?seller_id=${seller.id}`}
                className="flex flex-col items-center gap-3 shrink-0 group"
              >
                <div className="relative">
                  {seller.avatar_url ? (
                    <img
                      src={imageUrl(seller.avatar_url)}
                      alt={name}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/5 ring-2 ring-white/10 group-hover:ring-white/20 flex items-center justify-center transition-all duration-500">
                      <Store className="w-8 h-8 md:w-10 md:h-10 text-white/20 group-hover:text-white/40 transition-colors" />
                    </div>
                  )}
                </div>
                <span className="text-sm md:text-base font-medium text-white/40 group-hover:text-white/90 transition-colors whitespace-nowrap">
                  {name}
                </span>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
