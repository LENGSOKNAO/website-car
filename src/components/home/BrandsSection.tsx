import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
    <section className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">Our Sellers</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Trusted Dealers</h2>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {sellers.map((seller, i) => {
            const name = seller.full_name ?? seller.name ?? 'Seller'
            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/listings?seller_id=${seller.id}`}
                  className="group relative block aspect-[4/5] rounded-sm overflow-hidden bg-dark-900 border border-dark-800"
                >
                  {seller.bg ? (
                    <img
                      src={seller.bg}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-dark-800" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    {seller.avatar_url ? (
                      <img
                        src={imageUrl(seller.avatar_url)}
                        alt={name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white/20 mb-3"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center mb-3">
                        <span className="text-xs font-bold text-white/60">
                          {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                      {seller.dealer_name || name}
                    </h3>
                    {seller.dealer_name && (
                      <p className="text-xs text-white/50 mt-0.5 leading-relaxed transition-colors duration-300 group-hover:text-white/70">
                        {name}
                      </p>
                    )}
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
