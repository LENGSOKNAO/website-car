import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
export default function BrandsSection() {
  const [sellers, setSellers] = useState<any[]>([])

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch('/api/v1/web/sliders')
        const text = await res.text()
        console.log('sliders response:', text.slice(0, 500))
        const json = JSON.parse(text)
        const raw = json?.data?.data ?? json?.data ?? json ?? []
        const list = Array.isArray(raw) ? raw : []
        if (list.length > 0) {
          const map = new Map<string, any>()
          for (const s of list) {
            const u = s.user
            if (u?.id && !map.has(u.id)) {
              map.set(u.id, { ...u, full_name: u.full_name ?? u.name })
            }
          }
          if (map.size > 0) { setSellers(Array.from(map.values())); return }
        }
      } catch { /* ignore */ }
      try {
        const res = await fetch('/api/v1/users')
        const text = await res.text()
        console.log('users response:', text.slice(0, 500))
        const json = JSON.parse(text)
        const raw = json?.data?.data ?? json?.data ?? json ?? []
        const list = Array.isArray(raw) ? raw : []
        if (list.length > 0) {
          const filtered = list.filter((u: any) => u.role === 'seller' || u.is_dealer)
          setSellers(filtered.length > 0 ? filtered : list)
        }
      } catch { /* ignore */ }
    }
    fetchSellers()
  }, [])

  if (sellers.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              to={`/listings?seller_id=${seller.id}`}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              {seller.dealer_name || seller.full_name || seller.name || 'Seller'}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
