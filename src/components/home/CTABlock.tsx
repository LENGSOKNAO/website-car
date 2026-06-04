import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTABlock() {
  return (
    <section className="py-32 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />
      </div>
      <div className="relative text-center max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.25em] mb-4">Get Started</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to Find Your<br />Perfect Drive?
          </h2>
          <p className="mt-4 text-gray-400 text-sm max-w-md mx-auto">Join thousands of satisfied customers. Your next car is waiting.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/listings"
              className="bg-white text-gray-900 px-7 py-3 font-bold transition-all hover:bg-gray-100 flex items-center gap-2 text-sm"
            >
              Browse Inventory <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sell"
              className="border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 px-7 py-3 font-medium transition-all text-sm"
            >
              Sell Your Car
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
