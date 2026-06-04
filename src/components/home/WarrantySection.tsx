import { motion } from 'framer-motion'
import { Shield, Wrench, Car, Battery } from 'lucide-react'

const plans = [
  { icon: Shield, title: 'Powertrain Plus', desc: 'Engine, transmission, and drivetrain coverage up to 100K miles.', price: 'From $1,299' },
  { icon: Wrench, title: 'Comprehensive Care', desc: 'Full bumper-to-bumper protection including electronics and AC.', price: 'From $2,499' },
  { icon: Car, title: 'Maintenance Package', desc: 'Oil changes, brake pads, belts, and routine service included.', price: 'From $799/yr' },
  { icon: Battery, title: 'EV Protection', desc: 'Battery, charging system, and electric motor coverage.', price: 'From $1,899' },
]

export default function WarrantySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Protection</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Warranty & Protection Plans</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">Drive with peace of mind. Choose the coverage that fits your needs.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06 }}
              className="relative p-5 rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center mb-3">
                <plan.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{plan.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{plan.desc}</p>
              <p className="text-sm font-bold text-blue-600 mt-3">{plan.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
