import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const reviews = [
  { name: 'Sarah Johnson', role: 'First-time buyer', avatar: 'SJ', content: 'DriveMarket made my first car buying experience incredible. The financing options were clear, and I got my dream car delivered in 3 days!', rating: 5 },
  { name: 'Michael Chen', role: 'Car enthusiast', avatar: 'MC', content: "I've bought three cars through DriveMarket. The seller verification gives me complete confidence in every purchase.", rating: 5 },
  { name: 'Emily Rodriguez', role: 'Family buyer', avatar: 'ER', content: 'Found the perfect SUV for our family. The trade-in process was seamless. Highly recommend.', rating: 5 },
]

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-700 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="mt-2 text-sm text-gray-500">Real stories from real customers.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 relative group"
            >
              <Quote className="w-6 h-6 text-gray-100 absolute top-5 right-5 group-hover:text-gray-200 transition-colors duration-300" />
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{r.content}&rdquo;</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 ring-2 ring-white shadow-sm">{r.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
