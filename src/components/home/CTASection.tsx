import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative text-center max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">Ready to Find Your Dream Car?</h2>
          <p className="mt-3 text-sm text-dark-400">Join thousands of satisfied customers. Start browsing today.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/listings" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-sm font-medium transition-all flex items-center gap-2 text-sm">
              Browse Inventory <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/sell" className="border border-dark-700 text-dark-300 hover:text-white px-6 py-3 rounded-sm font-medium transition-all text-sm">Sell Your Car</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
