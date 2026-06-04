import { motion } from 'framer-motion'
import { Search, ClipboardCheck, Handshake, Key } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Search', desc: 'Browse our inventory with powerful filters to find exactly what you need.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: ClipboardCheck, title: 'Inspect', desc: 'View detailed histories, photos, and schedule inspections with ease.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Handshake, title: 'Negotiate', desc: 'Make offers, get financing pre-approval, and lock in your deal.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Key, title: 'Drive', desc: 'Complete paperwork online and get your car delivered to your door.', color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function StepsSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-700 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">Four easy steps to get you behind the wheel of your next car.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08 }}
                className="relative text-center group"
              >
                <div className={`w-14 h-14 ${step.bg} rounded-sm flex items-center justify-center mx-auto shadow-sm ring-4 ring-white group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
                  <step.icon className={`w-6 h-6 ${step.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <div className="mt-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-[10px] font-bold text-white mb-2 shadow-sm">{i + 1}</span>
                  <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
