import { motion } from 'framer-motion'
import { Shield, BadgeCheck, HeadphonesIcon, Truck, RefreshCw, Banknote } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Verified Dealers', desc: 'All sellers undergo a thorough verification process so you can buy with confidence.' },
  { icon: BadgeCheck, title: 'Vehicle History', desc: 'Every car comes with a detailed history report, accident checks, and service records.' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Our team is available around the clock to answer your questions.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Get your car delivered to your doorstep, anywhere in the country.' },
  { icon: RefreshCw, title: '7-Day Returns', desc: 'Not satisfied? Return within 7 days for a full refund, no questions asked.' },
  { icon: Banknote, title: 'Best Price Guarantee', desc: 'We match any verified lower price from a competing dealer.' },
]

export default function FeaturesGrid() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-700 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Built Different</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">We're redefining the car buying experience with transparency, trust, and technology.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.04 }}
              className="group p-6 rounded-sm bg-gray-50 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-500 relative"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors duration-300">
                <f.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
