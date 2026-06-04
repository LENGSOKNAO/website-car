import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BRANDS, BRAND_PAGES } from '@/lib/constants'

const logoUrls: Record<string, string> = {
  tesla: 'https://cdn.simpleicons.org/tesla/black',
  bmw: 'https://cdn.simpleicons.org/bmw/black',
  bugatti: 'https://cdn.simpleicons.org/bugatti/black',
  nissan: 'https://cdn.simpleicons.org/nissan/black',
  porsche: 'https://cdn.simpleicons.org/porsche/black',
}

export default function BrandsSection() {
  const [paused, setPaused] = useState(false)

  const logos = BRANDS.map((brand) => {
    const pageData = BRAND_PAGES.find((p) => p.slug === brand.slug)
    return { ...brand, route: pageData?.route ?? `/${brand.slug}` }
  })

  const doubled = [...logos, ...logos]

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-14 md:gap-20 items-center"
          animate={paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={paused ? {} : { duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              to={brand.route}
              className="block shrink-0"
            >
              <img
                src={logoUrls[brand.slug]}
                alt={brand.name}
                className="h-14 md:h-20 object-contain hover:scale-110 transition-transform duration-500"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
