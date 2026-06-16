import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ImageWithLoading from '@/components/ui/ImageWithLoading'
import img1 from '@/assets/slider/bugati/tourbillon-modelpage-02-scrollvideo-desktop.jpg'
import img2 from '@/assets/slider/tesla/Homepage-Card-Model-3-Desktop-US_PR_MX.avif'
import img3 from '@/assets/slider/porsch/filters_format(webp)_quality(80).webp'
import img4 from '@/assets/slider/bmw/X5-xDrive-40i-BMW-MAY-2026-OFFERS_16to7.webp'

const cars = [
  { img: img1, brand: 'Bugatti', model: 'Tourbillon', year: 2025, price: '$3,800,000', tag: 'Hypercar', color: 'bg-rose-500' },
  { img: img2, brand: 'Tesla', model: 'Model 3', year: 2025, price: '$42,990', tag: 'Electric', color: 'bg-teal-500' },
  { img: img3, brand: 'Porsche', model: '911 Carrera', year: 2024, price: '$129,900', tag: 'Sports', color: 'bg-amber-500' },
  { img: img4, brand: 'BMW', model: 'X5 xDrive40i', year: 2026, price: '$71,900', tag: 'Luxury SUV', color: 'bg-indigo-500' },
]

export default function ShowcaseGrid() {
  return (
    <section className="py-24 bg-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-[0.25em] mb-2">Featured Selection</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Curated for You</h2>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cars.map((car, i) => (
            <motion.div
              key={car.model}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithLoading
                  src={car.img}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="transition-all duration-700 group-hover:scale-105"
                  priority={i === 0}
                />
                <div className={`absolute top-3 left-0 ${car.color} px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider`}>
                  {car.tag}
                </div>
              </div>
              <div className="p-4 border-l-2 border-b border-r border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{car.brand}</p>
                <h3 className="text-sm font-bold text-gray-900">{car.model}</h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-base font-bold text-gray-900">{car.price}</span>
                  <span className="text-[10px] text-gray-400">{car.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
