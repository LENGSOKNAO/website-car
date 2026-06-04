import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Fuel, Gauge, Star, Calendar } from 'lucide-react'
import { BRAND_PAGES } from '@/lib/constants'
import img1 from '@/assets/slider/bugati/tourbillon-modelpage-02-scrollvideo-desktop.jpg'
import img2 from '@/assets/slider/tesla/Homepage-Card-Model-3-Desktop-US_PR_MX.avif'
import img3 from '@/assets/slider/porsch/filters_format(webp)_quality(80).webp'
import img4 from '@/assets/slider/bmw/X5-xDrive-40i-BMW-MAY-2026-OFFERS_16to7.webp'
import img5 from '@/assets/slider/gtr/2024-nissan-gt-r-sports-car-light-green-side-profile-view.webp'
import img6 from '@/assets/slider/tesla/Homepage-Vehicle-Card-Model-Y-Desktop-US-Snow.avif'

const products = [
  { img: img1, brandSlug: 'bugatti', model: 'Tourbillon', year: 2025, price: '$3,800,000', badge: 'Just Listed', fuel: 'Hybrid', miles: '120 mi', gear: 'Dual-Clutch', rating: 4.9 },
  { img: img2, brandSlug: 'tesla', model: 'Model 3', year: 2025, price: '$42,990', badge: 'Popular', fuel: 'Electric', miles: '50 mi', gear: 'Single-Speed', rating: 4.8 },
  { img: img3, brandSlug: 'porsche', model: '911 Carrera', year: 2024, price: '$129,900', badge: 'Premium', fuel: 'Gasoline', miles: '320 mi', gear: 'PDK', rating: 4.9 },
  { img: img4, brandSlug: 'bmw', model: 'X5 xDrive40i', year: 2026, price: '$71,900', badge: 'New Arrival', fuel: 'Gasoline', miles: '10 mi', gear: 'Automatic', rating: 4.7 },
  { img: img5, brandSlug: 'nissan', model: 'GT-R Nismo', year: 2024, price: '$220,000', badge: 'Iconic', fuel: 'Gasoline', miles: '800 mi', gear: 'Dual-Clutch', rating: 4.9 },
  { img: img6, brandSlug: 'tesla', model: 'Model Y', year: 2025, price: '$48,990', badge: 'Popular', fuel: 'Electric', miles: '30 mi', gear: 'Single-Speed', rating: 4.8 },
]

const badgeStyles: Record<string, string> = {
  'Just Listed': 'bg-emerald-500/90 text-white',
  'Popular': 'bg-blue-500/90 text-white',
  'Premium': 'bg-purple-500/90 text-white',
  'New Arrival': 'bg-amber-500/90 text-white',
  'Iconic': 'bg-rose-500/90 text-white',
}

export default function ProductsShowcase() {
  const [start, setStart] = useState(0)
  const maxStart = products.length - 3

  useEffect(() => {
    const timer = setInterval(() => setStart(p => (p >= maxStart ? 0 : p + 1)), 4000)
    return () => clearInterval(timer)
  }, [maxStart])

  const prev = () => setStart(p => (p <= 0 ? maxStart : p - 1))
  const next = () => setStart(p => (p >= maxStart ? 0 : p + 1))

  const visible = products.slice(start, start + 3)

  return (
    <section className="relative h-screen w-full bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Featured Collection
          </span>
          <Link to="/listings" className="hidden sm:flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="relative h-full flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-30 p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Handpicked for You
            </h2>
            <p className="text-xs md:text-sm text-white/40 mt-1 max-w-xl">
              Premium vehicles from our verified dealer network.
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-full">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => {
                const brandData = BRAND_PAGES.find(b => b.slug === item.brandSlug)
                const brandColor = brandData?.color ?? '#0066B1'
                return (
                  <motion.div
                    key={`${item.brandSlug}-${item.model}`}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="h-full"
                  >
                    <Link
                      to={`/${item.brandSlug}`}
                      className="group relative block overflow-hidden h-full"
                    >
                      <img
                        src={item.img}
                        alt={item.model}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                      <span className={`absolute top-6 left-6 px-3 py-1.5 rounded-sm text-xs font-semibold shadow-sm z-10 ${badgeStyles[item.badge] ?? 'bg-white/90 text-gray-700'}`}>
                        {item.badge}
                      </span>
                      <span className="absolute top-6 right-6 px-3 py-1.5 rounded-sm bg-black/50 backdrop-blur-sm text-xs font-semibold text-white/80 border border-white/10 z-10">
                        {item.year}
                      </span>

                      <div className="absolute top-0 left-0 w-1 h-full transition-all duration-500 group-hover:w-[3px] z-10" style={{ backgroundColor: brandColor === '#FFFFFF' ? '#3B82F6' : brandColor }} />

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-[2px] rounded-full shrink-0" style={{ backgroundColor: brandColor === '#FFFFFF' ? '#3B82F6' : brandColor }} />
                          <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">{brandData?.name ?? item.brandSlug}</p>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{item.model}</h3>
                        {brandData && <p className="text-xs text-white/30 mt-1 line-clamp-1">&ldquo;{brandData.tagline}&rdquo;</p>}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-2xl md:text-3xl font-bold text-white">{item.price}</span>
                          <span className="flex items-center gap-1 text-sm text-amber-400"><Star className="w-4 h-4 fill-amber-400" />{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-[11px] text-white/40">
                          <span className="flex items-center gap-1.5"><Fuel className="w-4 h-4 text-white/30" />{item.fuel}</span>
                          <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-white/30" />{item.miles}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white/30" />{item.gear}</span>
                        </div>
                      </div>

                      <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.03] pointer-events-none z-10" />
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-sm bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all z-20 cursor-pointer">
            <ChevronLeft className="w-5 h-6 text-white" />
          </button>
          <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-sm bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all z-20 cursor-pointer">
            <ChevronRight className="w-5 h-6 text-white" />
          </button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-20">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === start ? 'w-8 bg-blue-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}