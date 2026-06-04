import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Gift, Users, DollarSign, Star } from 'lucide-react'

const perks = [
  { icon: DollarSign, text: 'You get $200 credit when your friend buys' },
  { icon: Gift, text: 'Your friend gets $100 off their first purchase' },
  { icon: Star, text: 'No limit — refer as many friends as you want' },
]

export default function ReferralSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-sm bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="w-12 h-12 rounded-sm bg-blue-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Refer a Friend</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Share the Love.
                <br />
                <span className="text-blue-600">Earn Rewards.</span>
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-md leading-relaxed">
                Know someone looking for their next car? Refer them to DriveMarket and you both get rewarded.
              </p>

              <ul className="mt-5 space-y-2.5">
                {perks.map((perk) => (
                  <li key={perk.text} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <perk.icon className="w-3 h-3 text-blue-600" />
                    </span>
                    {perk.text}
                  </li>
                ))}
              </ul>

              <Link
                to="/referral"
                className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-sm font-medium transition-all text-sm shadow-sm"
              >
                Start Referring <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              className="flex justify-center"
            >
              <div className="text-center p-6 rounded-sm bg-white border border-blue-100 shadow-sm">
                <Gift className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">$200</p>
                <p className="text-xs text-gray-500">your reward per referral</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900">$100</p>
                  <p className="text-xs text-gray-500">friend's discount</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
