import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]" />
      </div>
      <div className="relative text-center max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">Ready to Find Your Dream Car?</h2>
          <p className="mt-3 text-sm text-blue-200">Join thousands of satisfied customers. Start browsing today.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/listings"
              className="bg-white text-blue-700 px-6 py-3 rounded-sm font-semibold transition-all hover:bg-blue-50 flex items-center gap-2 text-sm shadow-lg"
            >
              Browse Inventory <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sell"
              className="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-sm font-medium transition-all text-sm"
            >
              Sell Your Car
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
