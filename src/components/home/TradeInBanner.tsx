import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, DollarSign, Shield } from 'lucide-react'

export default function TradeInBanner() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-700 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Trade-In
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Turn Your Old Car
              <br />
              <span className="text-blue-600">Into a New One</span>
            </h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-md">
              Get a fair, instant offer for your current vehicle and put that value toward your next purchase. The entire process takes minutes.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { icon: DollarSign, text: 'Get an offer in under 2 minutes' },
                { icon: Shield, text: 'Guaranteed offer valid for 7 days' },
                { icon: RotateCcw, text: 'We handle all the paperwork' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-700 group">
                  <span className="w-8 h-8 rounded-sm bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                    <item.icon className="w-4 h-4 text-blue-600" />
                  </span>
                  {item.text}
                </div>
              ))}
            </div>

            <Link
              to="/trade-in"
              className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm font-medium transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              Value Your Trade <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            <div className="p-6 rounded-sm bg-gray-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full bg-blue-500" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Estimate Your Trade Value</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Vehicle Make</label>
                  <div className="w-full px-3 py-2.5 rounded-sm bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:border-blue-200 transition-colors">Select make</div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Vehicle Model</label>
                  <div className="w-full px-3 py-2.5 rounded-sm bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:border-blue-200 transition-colors">Select model</div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Year</label>
                  <div className="w-full px-3 py-2.5 rounded-sm bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:border-blue-200 transition-colors">Select year</div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1 block">Mileage</label>
                  <div className="w-full px-3 py-2.5 rounded-sm bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:border-blue-200 transition-colors">e.g. 45,000</div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-sm text-sm font-medium transition-all active:scale-[0.98] shadow-sm hover:shadow-md">
                  Get Estimate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
