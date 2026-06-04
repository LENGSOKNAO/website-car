import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Car, Building2, Users, Star } from 'lucide-react'

const stats = [
  { icon: Car, value: '12,400+', label: 'Vehicles Listed', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Building2, value: '580+', label: 'Verified Dealers', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Users, value: '18,500+', label: 'Happy Customers', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Star, value: '4.9', label: 'Average Rating', color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function StatsTrust() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-sm ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
