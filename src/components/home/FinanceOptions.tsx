import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Percent, Clock, CreditCard, FileText } from 'lucide-react'

const options = [
  { icon: Percent, title: 'Rates from 3.99% APR', desc: 'Competitive financing rates for qualified buyers with fast approval.' },
  { icon: Clock, title: 'Terms up to 84 Months', desc: 'Flexible payment plans with terms that fit your budget and lifestyle.' },
  { icon: CreditCard, title: 'Zero Down Available', desc: 'Qualified buyers can drive away with $0 down payment. Ask about eligibility.' },
  { icon: FileText, title: 'Pre-Approval in Minutes', desc: 'Get pre-approved online without impacting your credit score. Simple and fast.' },
]

export default function FinanceOptions() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Financing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Flexible Payment Options</h2>
            <p className="mt-1 text-sm text-gray-500">Get behind the wheel with a plan that works for you.</p>
          </div>
          <Link
            to="/financing"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06 }}
              className="p-5 rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center mb-3">
                <opt.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{opt.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{opt.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link to="/financing" className="text-sm text-blue-600 font-medium">
            Learn More <ArrowRight className="w-3.5 h-3.5 inline" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
