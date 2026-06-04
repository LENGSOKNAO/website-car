import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'

export default function TestDriveBanner() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Test Drive</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Feel the Road.
              <br />
              <span className="text-blue-600">Before You Decide.</span>
            </h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-md">
              Nothing beats the real thing. Schedule a test drive at a dealership near you or request a mobile test drive — we bring the car to you.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-sm bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-sm bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Find a Dealership Near You</p>
                  <p className="text-[10px] text-gray-500">Over 200 locations nationwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-sm bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-sm bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Mobile Test Drive</p>
                  <p className="text-[10px] text-gray-500">We bring the car to your home or office</p>
                </div>
              </div>
            </div>

            <Link
              to="/test-drive"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm font-medium transition-all text-sm shadow-sm"
            >
              Schedule a Test Drive <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            <div className="p-6 rounded-sm bg-white border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-900 mb-4">Quick Availability Check</p>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1 block">Make</label>
                  <div className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-gray-200 text-xs text-gray-500">All Makes</div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1 block">Model</label>
                  <div className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-gray-200 text-xs text-gray-500">All Models</div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1 block">ZIP Code</label>
                  <div className="w-full px-3 py-2 rounded-sm bg-gray-50 border border-gray-200 text-xs text-gray-500">Enter your ZIP</div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-sm text-sm font-medium transition-all">
                  Check Availability
                </button>
                <p className="text-[10px] text-gray-400 text-center">No commitment required. Free cancellation anytime.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
