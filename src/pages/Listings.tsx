import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CarFilters from '@/components/car/CarFilters'

export default function Listings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Browse Cars</span>
          </div>
        </div>
      </div>
      <CarFilters />
    </motion.div>
  )
}
