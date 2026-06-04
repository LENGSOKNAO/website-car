import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, ClipboardCheck, Handshake, Key } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Search', desc: 'Browse with powerful filters.', color: 'text-indigo-600', bar: 'bg-indigo-500' },
  { icon: ClipboardCheck, title: 'Inspect', desc: 'View histories & inspect.', color: 'text-teal-600', bar: 'bg-teal-500' },
  { icon: Handshake, title: 'Negotiate', desc: 'Make offers & finance.', color: 'text-amber-600', bar: 'bg-amber-500' },
  { icon: Key, title: 'Drive', desc: 'Complete & enjoy the ride.', color: 'text-rose-600', bar: 'bg-rose-500' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="mb-16"
        >
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.25em] mb-2">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">From Search to Drive<br />in Four Steps</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <div className={`w-full h-1 ${step.bar} rounded-full mb-5`} />
              <div className="flex items-center gap-3 mb-3">
                <step.icon className={`w-5 h-5 ${step.color}`} />
                <span className={`text-xs font-bold ${step.color}`}>0{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            Start Browsing <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
