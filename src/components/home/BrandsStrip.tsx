import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRANDS, BRAND_PAGES } from '@/lib/constants'

export default function BrandsStrip() {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-700 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {BRANDS.length} Brands
          </span>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {BRANDS.map((brand, i) => {
            const pageData = BRAND_PAGES.find((p) => p.slug === brand.slug)
            return (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/${brand.slug}`}
                  className="group flex items-center gap-3 p-3 md:p-4 rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="w-1 h-8 rounded-full shrink-0 transition-all duration-300 group-hover:h-10"
                    style={{ backgroundColor: brand.color || '#3B82F6' }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 uppercase tracking-wider truncate">
                      {brand.name}
                    </p>
                    {pageData && (
                      <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                        {pageData.models.length} models
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
