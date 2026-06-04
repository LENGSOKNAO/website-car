import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  { name: 'Sarah Johnson', role: 'First-time buyer', content: 'DriveMarket made my first car buying experience incredible. The financing options were clear, and I got my dream car delivered in 3 days.', rating: 5 },
  { name: 'Michael Chen', role: 'Car enthusiast', content: "I've bought three cars through DriveMarket. The seller verification gives me complete confidence in every purchase.", rating: 5 },
  { name: 'Emily Rodriguez', role: 'Family buyer', content: 'Found the perfect SUV for our family. The trade-in process was seamless. Highly recommend DriveMarket to anyone looking for a hassle-free experience.', rating: 5 },
]

export default function QuotesSection() {
  return (
    <section className="py-24 bg-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="mb-16"
        >
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.25em] mb-2">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">What Drivers Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Quote className="w-8 h-8 text-teal-300 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-teal-200">
                <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-xs font-bold text-teal-700">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
