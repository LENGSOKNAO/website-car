import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  { name: 'Sarah Johnson', role: 'First-time buyer', avatar: 'SJ', content: 'DriveMarket made my first car buying experience incredible. The financing options were clear, and I got my dream car delivered in 3 days!', rating: 5 },
  { name: 'Michael Chen', role: 'Car enthusiast', avatar: 'MC', content: "I've bought three cars through DriveMarket. The seller verification gives me complete confidence in every purchase.", rating: 5 },
  { name: 'Emily Rodriguez', role: 'Family buyer', avatar: 'ER', content: 'Found the perfect SUV for our family. The trade-in process was seamless. Highly recommend.', rating: 5 },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-dark-975">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14">
          <p className="text-xs text-dark-400 uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">What Our Customers Say</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.08 }}
              className="p-6 rounded-sm border border-dark-800 bg-dark-975 relative">
              <Quote className="w-8 h-8 text-dark-800 absolute top-5 right-5" />
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-blue-400 fill-blue-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-dark-300 leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-dark-800">
                <div className="w-9 h-9 rounded-full bg-dark-800 flex items-center justify-center text-xs font-bold text-dark-300">{t.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-dark-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
