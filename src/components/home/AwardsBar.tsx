import { motion } from 'framer-motion'
import { Award, Shield, BadgeCheck, ThumbsUp } from 'lucide-react'

const badges = [
  { icon: Shield, label: 'SOC 2 Compliant', sub: 'Enterprise security' },
  { icon: BadgeCheck, label: 'BBB Accredited', sub: 'A+ rating since 2020' },
  { icon: ThumbsUp, label: '4.9 ★ Trustpilot', sub: '2,500+ reviews' },
  { icon: Award, label: 'Best Auto Platform', sub: '2025 Industry Award' },
]

export default function AwardsBar() {
  return (
    <section className="py-10 bg-gray-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 justify-center md:justify-start group"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all duration-300">
                <b.icon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{b.label}</p>
                <p className="text-[10px] text-gray-500">{b.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
