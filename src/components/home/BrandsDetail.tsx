import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BRAND_PAGES } from '@/lib/constants'
import { imageUrl } from '@/lib/utils'
import ImageWithLoading from '@/components/ui/ImageWithLoading'

export default function BrandsDetail() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Our Brands</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explore by Manufacturer</h2>
          <p className="mt-1 text-sm text-gray-500">Detailed specs, stats, and model lineups for every brand.</p>
        </motion.div>

        <div className="space-y-5">
          {BRAND_PAGES.map((brand, i) => {
            const slide = brand.slider[0]
            return (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={brand.route}
                  className="group flex flex-col sm:flex-row rounded-sm overflow-hidden border border-gray-200 bg-gray-50 hover:shadow-md transition-all duration-300"
                >
                  <div className="sm:w-72 h-48 sm:h-auto shrink-0 overflow-hidden">
                    {slide && (
                      <ImageWithLoading
                        src={imageUrl(slide.image)}
                        alt={brand.name}
                        fill
                        className="transition-all duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: brand.color }} />
                        <span className="text-xs font-bold text-gray-900 tracking-wider uppercase">{brand.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 italic mb-2">&ldquo;{slide?.tagline}&rdquo;</p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{slide?.description}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-6">
                      {brand.stats.map(stat => (
                        <div key={stat.label} className="text-center">
                          <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                          <p className="text-[10px] text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                      <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1 ml-auto">
                        View {brand.name} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {brand.models.map(m => (
                        <span key={m} className="px-2 py-0.5 rounded-sm bg-white border border-gray-200 text-[10px] text-gray-600">
                          {m}
                        </span>
                      ))}
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
