import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, MapPin, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { imageUrl } from '@/lib/utils'

export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([])

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.sliders()
        const raw = (res as any)?.data?.data ?? (res as any)?.data ?? res ?? []
        const list = Array.isArray(raw) ? raw : []
        const map = new Map<string, any>()
        for (const s of list) {
          const u = s.user
          if (u?.id && !map.has(u.id)) {
            map.set(u.id, {
              ...u,
              full_name: u.full_name ?? u.name,
              avatar_url: u.avatar_url ?? u.avatar ?? u.image,
              bg: imageUrl(s.image),
            })
          }
        }
        if (map.size > 0) { setSellers(Array.from(map.values())); return }
      } catch { /* ignore */ }
      try {
        const res = await api.users()
        const raw = (res as any)?.data?.data ?? (res as any)?.data ?? res ?? []
        const list = Array.isArray(raw) ? raw : []
        const filtered = list.filter((u: any) => u.role === 'seller' || u.is_dealer)
        setSellers(filtered.length > 0 ? filtered : list)
      } catch { /* ignore */ }
    }
    fetchSellers()
  }, [])

  if (sellers.length === 0) return null

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">Trusted Sellers</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Meet Our Sellers</h2>
          </div>
          <Link to="/listings" className="hidden sm:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group">
            View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {sellers.map((seller, i) => {
            const name = seller.full_name ?? seller.name ?? 'Seller'
            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/listings?seller_id=${seller.id}`}
                  className="group block relative rounded-xl overflow-hidden bg-dark-900 border border-dark-800 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {seller.bg ? (
                      <img
                        src={seller.bg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                      Verified
                    </div>
                  </div>
                  <div className="relative -mt-10 mx-4 mb-4">
                    <div className="flex items-end gap-3">
                      {seller.avatar_url ? (
                        <img
                          src={imageUrl(seller.avatar_url)}
                          alt={name}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-dark-900 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-dark-700 ring-2 ring-dark-900 flex items-center justify-center shrink-0">
                          <Store className="w-5 h-5 text-dark-400" />
                        </div>
                      )}
                      <div className="min-w-0 pb-1">
                        <p className="text-sm md:text-base font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                          {seller.dealer_name || name}
                        </p>
                        {seller.dealer_name && (
                          <p className="text-[11px] text-dark-400 truncate">{name}</p>
                        )}
                      </div>
                    </div>
                    {seller.location && (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-dark-400">
                        <MapPin className="w-3 h-3" />
                        {seller.location}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between">
                      <span className="text-[11px] text-dark-500">View Listings</span>
                      <ChevronRight className="w-3.5 h-3.5 text-dark-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
