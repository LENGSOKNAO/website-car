import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import Avatar from '@/components/ui/Avatar'

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
    <section className="py-20 bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">
            Trusted Partners
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Our Verified Sellers
          </h2>
        </motion.div>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-6 items-stretch"
          animate={paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={paused ? {} : { duration: 45, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((seller, i) => {
            const name = seller.full_name ?? seller.name ?? 'Seller'
            return (
              <Link
                key={`${seller.id}-${i}`}
                to={`/listings?seller_id=${seller.id}`}
                className="group shrink-0"
              >
                <div className="w-44 md:w-52 bg-dark-900 border border-dark-800 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="relative">
                      <Avatar name={name} src={seller.avatar_url} size="lg" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-dark-900" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight">
                        {seller.dealer_name || name}
                      </p>
                      {seller.dealer_name && (
                        <p className="text-xs text-dark-400 mt-0.5">{name}</p>
                      )}
                      {seller.location && (
                        <p className="text-xs text-dark-400 mt-1">{seller.location}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Listings <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
