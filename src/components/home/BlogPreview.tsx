import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, BarChart3 } from 'lucide-react'
import { BRAND_PAGES } from '@/lib/constants'

const articles = [
  {
    title: '2026 Toyota Camry vs Honda Accord: Which Sedan Wins?',
    excerpt: 'We put the two best-selling sedans head-to-head across fuel economy, tech, safety, and pricing to help you decide.',
    date: 'May 22, 2026', readTime: '7 min read', tag: 'Comparison', icon: BarChart3,
    slug: '/blog/camry-vs-accord-2026',
  },
  {
    title: 'Electric Vehicle Range Test: 10 Popular EVs Compared',
    excerpt: 'We drove 10 electric vehicles on the same highway loop to test real-world range vs EPA estimates. The results might surprise you.',
    date: 'May 18, 2026', readTime: '10 min read', tag: 'EV Guide', icon: BarChart3,
    slug: '/blog/ev-range-test-2026',
  },
  {
    title: `${BRAND_PAGES[0].models[0]}, ${BRAND_PAGES[0].models[1]}, or ${BRAND_PAGES[0].models[3]}: Which ${BRAND_PAGES[0].name} Is Right for You?`,
    excerpt: `Breaking down the ${BRAND_PAGES[0].name} lineup — from range and performance to pricing and features. Find your perfect match.`,
    date: 'May 14, 2026', readTime: '6 min read', tag: 'Buying Guide', icon: BarChart3,
    slug: '/blog/tesla-model-guide',
  },
]

export default function BlogPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Articles</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Insights & Reviews</h2>
            <p className="text-sm text-gray-500 mt-1">Expert reviews, comparisons, and buying guides.</p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={post.slug}
                className="group block rounded-sm bg-gray-50 border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-5 left-5 w-20 h-20 rounded-full bg-blue-400" />
                    <div className="absolute bottom-5 right-5 w-32 h-32 rounded-full bg-indigo-400" />
                  </div>
                  <post.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="p-5">
                  <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-[10px] font-semibold text-blue-700 uppercase tracking-wider">{post.tag}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-2 group-hover:text-blue-700 transition-colors duration-300 leading-snug">{post.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link to="/blog" className="text-sm text-blue-600 font-medium">
            View All Articles <ArrowRight className="w-3.5 h-3.5 inline" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
