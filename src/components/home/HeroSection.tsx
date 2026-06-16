import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Star, ChevronRight, ChevronLeft, Loader } from 'lucide-react'
import { cn, imageUrl } from '@/lib/utils'
import { api } from '@/lib/api'
import ImageWithLoading from '@/components/ui/ImageWithLoading'

export default function HeroSection() {
  const navigate = useNavigate()
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.sliders()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? []
        const list = Array.isArray(raw) ? raw : []
        const sellerMap = new Map<string, any>()
        for (const s of list) {
          const key = s.user?.id ?? s.seller_id ?? s.id
          if (!sellerMap.has(key)) {
            sellerMap.set(key, s)
          }
        }
        setSlides(Array.from(sellerMap.values()))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length)
  const next = () => setCurrent(p => (p + 1) % slides.length)

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-dark-975">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-975">
          <Loader className="w-10 h-10 text-gray-300 animate-spin" />
        </div>
      )}
      {slides.map((slide, i) => (
        <div key={slide.id ?? i} className={cn(
          'absolute inset-0 transition-all duration-700',
          i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        )}>
          <ImageWithLoading src={imageUrl(slide.image)} alt={slide.title ?? ''} fill className="w-full h-full object-cover" priority={i === current} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(70deg, black 0%, black 10%, transparent 80%)' }} />
          <div className="absolute inset-0 bg-dark-975/30" />
        </div>
      ))}

      <div className="relative w-full">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white/80 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Trusted by 10,000+ customers
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Find Your
              <br />
              <span className="text-blue-400">Perfect Drive</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
              Browse thousands of quality vehicles from verified dealers. Your next car is waiting.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = (e.target as HTMLFormElement).querySelector('input')?.value
                  if (input?.trim()) navigate(`/listings?search=${encodeURIComponent(input.trim())}`)
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-xl"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input type="text" placeholder="Search make, model, or keyword..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-sm text-sm bg-dark-900/80 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all" />
                </div>
                <button type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm whitespace-nowrap">
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-wrap gap-5">
              {[
                { label: 'New Cars', href: '/listings?condition=new' },
                { label: 'Used Cars', href: '/listings?condition=used' },
                { label: 'Certified Pre-Owned', href: '/listings?condition=certified' },
                { label: 'Sell Your Car', href: '/sell' },
              ].map((link) => (
                <Link key={link.label} to={link.href}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors group/link">
                  {link.label}
                  <ChevronRight className="w-3 h-3 opacity-0 -ml-2 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all duration-200" />
                </Link>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 flex items-center gap-8 text-sm">
              {[
                { value: '10K+', label: 'Vehicles' },
                { value: '500+', label: 'Dealers' },
                { value: '15K+', label: 'Customers' },
                { value: '4.9', label: 'Rating', star: true },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                    {stat.star && <Star className="w-3 h-3 text-blue-400 fill-blue-400" />}
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <button onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 cursor-pointer flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-8 right-8 z-10 hidden sm:block">
          <p className="text-xs text-white/70 font-medium bg-black/30 px-2 py-1 rounded-sm">
            {slides[current]?.badge ?? slides[current]?.title ?? ''}
          </p>
        </div>
      </div>
    </section>
  )
}
