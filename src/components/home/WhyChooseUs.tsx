import { motion } from 'framer-motion'
import { Shield, BadgeCheck, HeadphonesIcon, Truck, RefreshCw, Banknote } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Verified Dealers', desc: 'All sellers undergo a thorough verification process.' },
  { icon: BadgeCheck, title: 'Vehicle History', desc: 'Every car comes with a detailed history report.' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Our team is available around the clock.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Get your car delivered to your doorstep.' },
  { icon: RefreshCw, title: '7-Day Returns', desc: 'Not satisfied? Return within 7 days.' },
  { icon: Banknote, title: 'Best Price Guarantee', desc: 'We match any verified lower price.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-dark-975">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14">
          <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Built Different</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.04 }}
              className="p-5 rounded-sm border border-dark-800 bg-dark-975 card-hover-dark">
              <div className="w-10 h-10 rounded-sm bg-blue-600/10 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-medium text-white text-sm">{f.title}</h3>
              <p className="text-xs text-dark-400 mt-1.5 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
