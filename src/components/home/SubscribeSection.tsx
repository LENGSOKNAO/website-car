import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Mail } from 'lucide-react'

export default function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-8 md:p-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Stay in the Loop</h3>
                <p className="text-xs text-gray-500 mt-0.5">Get the latest deals and new arrivals straight to your inbox.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3 w-full md:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-sm shadow-sm">
                  <CheckCircle className="w-4 h-4" /> You're subscribed!
                </div>
              ) : (
                <>
                  <div className="relative flex-1 md:flex-none">
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email" required
                      className="px-4 py-2.5 rounded-sm w-full md:w-56 text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" /> Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
