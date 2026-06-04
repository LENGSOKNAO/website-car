import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.25em] mb-2">Newsletter</p>
          <h3 className="text-2xl font-bold text-gray-900">Stay in the Loop</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">Get the latest deals and new arrivals straight to your inbox.</p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-50 px-5 py-3 w-full justify-center">
                <CheckCircle className="w-4 h-4" /> You're subscribed!
              </div>
            ) : (
              <>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" required
                  className="flex-1 px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Subscribe
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
