import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Truck, CalendarCheck, MessageCircle } from 'lucide-react'

const steps = [
  { icon: ClipboardCheck, title: 'Purchase Online', desc: 'Complete all paperwork digitally from your home.' },
  { icon: Truck, title: 'We Prepare & Ship', desc: 'We detail, inspect, and load your car onto a covered carrier.' },
  { icon: CalendarCheck, title: 'Track in Real-Time', desc: 'Get live GPS tracking and estimated delivery window.' },
  { icon: MessageCircle, title: 'Arrives at Your Door', desc: 'Sign delivery receipt and handoff. That is it.' },
]

export default function DeliverySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Delivery</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Nationwide Doorstep Delivery</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">We bring the dealership to you. Free delivery within 200 miles.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08 }}
              className="relative text-center"
            >
              <div className="w-14 h-14 rounded-sm bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+32px)] right-[calc(50%-50%)] h-px bg-gray-200" />
              )}
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 mb-2">{i + 1}</span>
              <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
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
            Browse Vehicles with Free Delivery <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
