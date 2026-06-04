import { motion } from 'framer-motion'

const stats = [
  { value: '12,400+', label: 'Vehicles Listed', color: 'bg-indigo-500' },
  { value: '580+', label: 'Verified Dealers', color: 'bg-teal-500' },
  { value: '18,500+', label: 'Happy Customers', color: 'bg-amber-500' },
  { value: '4.9', label: 'Average Rating', color: 'bg-rose-500' },
]

export default function StatsRow() {
  return (
    <section className="py-20 bg-indigo-50">
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
              <p className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
              <div className={`w-8 h-1 ${stat.color} rounded-full mx-auto mt-2 mb-3`} />
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
