import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calculator, DollarSign } from 'lucide-react'

const ranges = [
  { label: 'Under $20,000', query: 'price_max=20000', count: '342 vehicles' },
  { label: '$20K — $40K', query: 'price_min=20000&price_max=40000', count: '1,280 vehicles' },
  { label: '$40K — $70K', query: 'price_min=40000&price_max=70000', count: '956 vehicles' },
  { label: '$70K — $100K', query: 'price_min=70000&price_max=100000', count: '412 vehicles' },
  { label: '$100K+', query: 'price_min=100000', count: '215 vehicles' },
]

export default function PriceRanges() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Price Range</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Budget</h2>
          <p className="mt-2 text-sm text-gray-500">Find cars that fit your budget, from entry-level to exotic.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ranges.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/listings?${r.query}`}
                className="block p-5 rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors duration-300">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{r.label}</p>
                <p className="text-[10px] text-gray-500 mt-1">{r.count}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <Calculator className="w-4 h-4" />
            Use Advanced Filters
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
