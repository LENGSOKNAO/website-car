import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Car, Building2, Users, Star } from 'lucide-react'

const stats = [
  { icon: Car, value: 12400, suffix: '+', label: 'Vehicles Listed' },
  { icon: Building2, value: 580, suffix: '+', label: 'Verified Dealers' },
  { icon: Users, value: 18500, suffix: '+', label: 'Happy Customers' },
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', decimal: true },
]

function AnimatedCounter({ target, decimal = false }: { target: number; decimal?: boolean }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, inView])

  return <span ref={ref}>{decimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}</span>
}

export default function StatsBanner() {
  return (
    <section className="relative overflow-hidden bg-dark-975 border-t border-b border-dark-800">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[150px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-sm bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                <AnimatedCounter target={stat.value} decimal={stat.decimal} />
                {stat.suffix}
              </p>
              <p className="text-xs text-dark-400 mt-1.5 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
