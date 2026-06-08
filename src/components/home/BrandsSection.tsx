import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
              <Avatar name={seller.full_name ?? seller.name ?? 'Seller'} src={seller.avatar_url} size="lg" />
              <span className="text-xs md:text-sm text-gray-500 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                {seller.full_name ?? seller.name ?? 'Seller'}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
