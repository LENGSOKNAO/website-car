import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Fuel, Gauge, Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { BRAND_PAGES } from '@/lib/constants'
import img1 from '@/assets/slider/bugati/tourbillon-modelpage-02-scrollvideo-desktop.jpg'
import img2 from '@/assets/slider/tesla/Homepage-Card-Model-3-Desktop-US_PR_MX.avif'
import img3 from '@/assets/slider/porsch/filters_format(webp)_quality(80).webp'
import img4 from '@/assets/slider/bmw/X5-xDrive-40i-BMW-MAY-2026-OFFERS_16to7.webp'

const listings = [
  { img: img1, brandSlug: 'bugatti', model: 'Tourbillon', year: 2025, price: '$3,800,000', badge: 'Just Listed', fuel: 'Hybrid', miles: '120 mi', gear: 'Dual-Clutch' },
  { img: img2, brandSlug: 'tesla', model: 'Model 3', year: 2025, price: '$42,990', badge: 'Popular', fuel: 'Electric', miles: '50 mi', gear: 'Single-Speed' },
  { img: img3, brandSlug: 'porsche', model: '911 Carrera', year: 2024, price: '$129,900', badge: 'Premium', fuel: 'Gasoline', miles: '320 mi', gear: 'PDK' },
  { img: img4, brandSlug: 'bmw', model: 'X5 xDrive40i', year: 2026, price: '$71,900', badge: 'New Arrival', fuel: 'Gasoline', miles: '10 mi', gear: 'Automatic' },
]

const badgeStyles: Record<string, string> = {
  'Just Listed': 'bg-emerald-500 text-white',
  'Popular': 'bg-blue-500 text-white',
  'Premium': 'bg-purple-500 text-white',
  'New Arrival': 'bg-amber-500 text-white',
}

const variants = {
  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function FeaturedCars() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(0)
  const car = listings[current]
  const brandData = BRAND_PAGES.find(b => b.slug === car.brandSlug)
  const brandColor = brandData?.color ?? '#0066B1'

  useEffect(() => {
    const timer = setInterval(() => { setDir(1); setCurrent(p => (p + 1) % listings.length) }, 5000)
    return () => clearInterval(timer)
  }, [])

  const go = (i: number) => { setDir(i > current ? 1 : -1); setCurrent(i) }
  const prev = () => { setDir(-1); setCurrent(p => (p === 0 ? listings.length - 1 : p - 1)) }
  const next = () => { setDir(1); setCurrent(p => (p + 1) % listings.length) }

  return (
    <section className="relative h-screen w-full bg-gray-900 overflow-hidden">
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={current}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img src={car.img} alt={car.model} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-semibold text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Featured Vehicles
          </span>
          <Link to="/listings" className="hidden sm:flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-semibold shadow-sm ${badgeStyles[car.badge] ?? 'bg-white/90 text-gray-700'}`}>
                {car.badge}
              </span>
              <span className="text-[10px] text-white/50">{car.year}</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              {car.model}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-5 h-[2px] rounded-full" style={{ backgroundColor: brandColor === '#FFFFFF' ? '#3B82F6' : brandColor }} />
              <span className="text-sm text-white/60">{brandData?.name}</span>
            </div>
            <p className="text-sm text-white/40 mt-2 max-w-md leading-relaxed">{brandData?.tagline}</p>

            <div className="flex items-center gap-6 mt-5">
              <span className="text-2xl md:text-3xl font-bold text-white">{car.price}</span>
              <span className="flex items-center gap-1 text-xs text-white/50"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9</span>
            </div>

            <div className="flex items-center gap-5 mt-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-white/40" />{car.fuel}</span>
              <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-white/40" />{car.miles}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/40" />{car.gear}</span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Link
                to={`/${car.brandSlug}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-all active:scale-[0.98] shadow-lg"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/listings?brand=${car.brandSlug}`}
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-all"
              >
                Browse {brandData?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all z-10 cursor-pointer">
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all z-10 cursor-pointer">
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 z-10 flex items-center gap-2">
        {listings.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
        ))}
      </div>
    </section>
  )
}
