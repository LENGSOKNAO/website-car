import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Fuel, Gauge, Calendar, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import ImageWithLoading from '@/components/ui/ImageWithLoading'
import img1 from '@/assets/slider/bugati/tourbillon-modelpage-02-scrollvideo-desktop.jpg'
import img2 from '@/assets/slider/tesla/Homepage-Card-Model-3-Desktop-US_PR_MX.avif'
import img3 from '@/assets/slider/porsch/filters_format(webp)_quality(80).webp'
import img4 from '@/assets/slider/bmw/X5-xDrive-40i-BMW-MAY-2026-OFFERS_16to7.webp'

const deals = [
  {
    img: img1, brand: 'Bugatti', model: 'Tourbillon', year: 2025,
    price: 3800000, originalPrice: 4200000, badge: 'Best Offer',
    specs: { fuel: 'Hybrid', miles: '120 mi', gear: 'Automatic' },
    color: 'from-blue-600 to-purple-600',
  },
  {
    img: img2, brand: 'Tesla', model: 'Model 3', year: 2025,
    price: 42990, originalPrice: 47990, badge: 'Popular',
    specs: { fuel: 'Electric', miles: '50 mi', gear: 'Automatic' },
    color: 'from-emerald-500 to-teal-600',
  },
  {
    img: img3, brand: 'Porsche', model: '911 Carrera', year: 2024,
    price: 129900, originalPrice: 145000, badge: 'Premium',
    specs: { fuel: 'Gasoline', miles: '320 mi', gear: 'PDK' },
    color: 'from-amber-500 to-orange-600',
  },
  {
    img: img4, brand: 'BMW', model: 'X5 xDrive40i', year: 2026,
    price: 71900, originalPrice: 78900, badge: 'New Arrival',
    specs: { fuel: 'Gasoline', miles: '10 mi', gear: 'Automatic' },
    color: 'from-sky-500 to-blue-600',
  },
]

export default function FeaturedDeals() {
  return (
    <section className="py-20 bg-dark-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="w-12 h-1 rounded-full mb-4 bg-white" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 text-white/70">Hot Deals</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Offers</h2>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.model}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-sm overflow-hidden border border-dark-800 bg-dark-900"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithLoading
                  src={deal.img}
                  alt={`${deal.brand} ${deal.model}`}
                  fill
                  className="transition-all duration-700 group-hover:scale-110"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />
                <div className={cn(
                  'absolute top-3 left-3 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white',
                  `bg-gradient-to-r ${deal.color}`
                )}>
                  {deal.badge}
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-sm bg-dark-950/60 backdrop-blur-sm text-[11px] font-semibold text-white">
                  {deal.year}
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-0.5">{deal.brand}</p>
                <h3 className="text-sm font-bold text-white">{deal.model}</h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-white">${deal.price.toLocaleString()}</span>
                  {deal.originalPrice && (
                    <span className="text-xs text-dark-500 line-through">${deal.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dark-800 text-[11px] text-dark-400">
                  <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{deal.specs.fuel}</span>
                  <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{deal.specs.miles}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Auto</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link to="/listings" className="text-sm text-blue-400 hover:text-blue-300">
            View All Vehicles <ArrowRight className="w-3.5 h-3.5 inline" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
