import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Car } from 'lucide-react'
import CarCard from '@/components/car/CarCard'
import { api } from '@/lib/api'
import type { CarListing } from '@/lib/types'

export default function FeaturedListings() {
  const [listings, setListings] = useState<CarListing[]>([])

  useEffect(() => {
    api.listings({ per_page: 6, status: 'in_stock', sort: 'created_at:desc' })
      .then((res) => { const d = res.data?.data || res.data || []; setListings(Array.isArray(d) ? d : []) })
      .catch(() => {})
  }, [])

  return (
    <section className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">Featured Vehicles</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Latest Arrivals</h2>
          </div>
          <Link to="/listings" className="hidden sm:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group">
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {listings.map((listing, i) => <CarCard key={listing.id} listing={listing} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-dark-600">
            <Car className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">Listings will appear once the backend is connected.</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/listings" className="text-sm text-blue-400 hover:text-blue-300">View All Vehicles <ArrowRight className="w-3.5 h-3.5 inline" /></Link>
        </div>
      </div>
    </section>
  )
}
