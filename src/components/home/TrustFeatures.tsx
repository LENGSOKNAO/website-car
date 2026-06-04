import { motion } from 'framer-motion'
import { Shield, BadgeCheck, HeadphonesIcon, Truck, RefreshCw, Banknote } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Verified Dealers', desc: 'All sellers undergo a thorough verification process.', color: 'border-l-indigo-500' },
  { icon: BadgeCheck, title: 'Vehicle History', desc: 'Every car comes with a detailed history report.', color: 'border-l-teal-500' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Our team is available around the clock.', color: 'border-l-amber-500' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Free delivery within 200 miles of any dealer.', color: 'border-l-rose-500' },
  { icon: RefreshCw, title: '7-Day Returns', desc: 'Not satisfied? Return for a full refund.', color: 'border-l-indigo-500' },
  { icon: Banknote, title: 'Best Price Guarantee', desc: 'We match any verified lower price.', color: 'border-l-teal-500' },
]

export default function TrustFeatures() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="mb-16"
        >
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.25em] mb-2">Why Choose Us</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Trust Built Into<br />Every Transaction</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`border-l-2 ${f.color} pl-5 py-3`}
            >
              <f.icon className="w-5 h-5 text-gray-700 mb-2" />
              <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
