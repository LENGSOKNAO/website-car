import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Car, Truck, Gauge, Wind, Luggage, Cog } from 'lucide-react'

const types = [
  { icon: Car, label: 'Sedan', desc: '4-door saloons', query: 'body=sedan' },
  { icon: Truck, label: 'SUV', desc: 'Sport utility vehicles', query: 'body=suv' },
  { icon: Gauge, label: 'Coupe', desc: '2-door sports cars', query: 'body=coupe' },
  { icon: Wind, label: 'Convertible', desc: 'Open-top driving', query: 'body=convertible' },
  { icon: Luggage, label: 'Hatchback', desc: 'Compact & practical', query: 'body=hatchback' },
  { icon: Cog, label: 'Truck', desc: 'Pickups & vans', query: 'body=truck' },
]

export default function BrowseByType() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Browse by Type</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Find Your Body Style</h2>
          <p className="mt-2 text-sm text-gray-500">Whatever you're looking for, we've got you covered.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {types.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/listings?${t.query}`}
                className="flex flex-col items-center gap-2 p-5 rounded-sm bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-sm bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300">
                  <t.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{t.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
