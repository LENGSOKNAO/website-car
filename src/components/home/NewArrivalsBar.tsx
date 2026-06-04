import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Zap } from 'lucide-react'

export default function NewArrivalsBar() {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <Zap className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                <span className="text-emerald-600">43 new</span> vehicles added today
              </p>
              <p className="text-[10px] text-gray-500">Updated in real-time from verified dealers</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+12%</span> vs last week
            </div>
            <Link
              to="/listings?sort=created_at:desc"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group"
            >
              View Newest <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
