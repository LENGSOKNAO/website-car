import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { imageUrl } from '@/lib/utils'

export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([])

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

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
          {sellers.map((seller) => {
            const name = seller.dealer_name || seller.full_name || seller.name || 'Seller'
            return (
              <Link
                key={seller.id}
                to={`/listings?seller_id=${seller.id}`}
                className="flex flex-col items-center gap-2 group"
              >
                {seller.avatar_url ? (
                  <img
                    src={imageUrl(seller.avatar_url)}
                    alt={name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all"
                  />
                ) : (
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 ring-2 ring-white/10 group-hover:ring-blue-400/50 flex items-center justify-center transition-all">
                    <span className="text-xs font-bold text-white/40 group-hover:text-white/70">
                      {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                  {name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
