import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { imageUrl } from '@/lib/utils'

export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.users()
        const raw = (res as any)?.data?.data ?? (res as any)?.data ?? res ?? []
        const list = Array.isArray(raw) ? raw : []
        const filtered = list.filter((u: any) => u.role === 'seller' || u.is_dealer)
        if (filtered.length > 0) { setSellers(filtered); return }
        if (list.length > 0) { setSellers(list); return }
      } catch { /* ignore */ }
      try {
        const res = await api.sliders()
        const raw = (res as any)?.data?.data ?? (res as any)?.data ?? res ?? []
        const list = Array.isArray(raw) ? raw : []
        const map = new Map<string, any>()
        for (const s of list) {
          const u = s.user
          if (u?.id && !map.has(u.id)) {
            map.set(u.id, { ...u, full_name: u.full_name ?? u.name, avatar_url: u.avatar_url ?? u.avatar ?? u.image })
          }
        }
        if (map.size > 0) setSellers(Array.from(map.values()))
      } catch { /* ignore */ }
    }
    fetchSellers()
  }, [])

  if (sellers.length === 0) return null

  const doubled = [...sellers, ...sellers]

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-10 md:gap-16 items-center"
          animate={paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={paused ? {} : { duration: 60, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((seller, i) => {
            const name = seller.full_name ?? seller.name ?? 'Seller'
            const avatarSrc = seller.avatar_url ? imageUrl(seller.avatar_url) : ''
            return (
              <Link
                key={`${seller.id}-${i}`}
                to={`/listings?seller_id=${seller.id}`}
                className="flex flex-col items-center gap-4 shrink-0 group"
              >
                <div className="relative">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={name}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/5 ring-2 ring-white/10 group-hover:ring-blue-400/50 flex items-center justify-center transition-all duration-500">
                      <span className="text-xl md:text-2xl font-bold text-white/40 group-hover:text-white/70 transition-colors">
                        {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white/5" />
                </div>
                <span className="text-base md:text-lg font-medium text-white/60 group-hover:text-white transition-colors whitespace-nowrap">
                  {seller.dealer_name || name}
                </span>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
