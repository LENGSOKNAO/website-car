import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <section className="py-16 bg-dark-975 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-sm border border-dark-800 bg-dark-900 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white">Stay in the Loop</h3>
              <p className="text-xs text-dark-400 mt-1">Get the latest deals and new arrivals straight to your inbox.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3 w-full md:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle className="w-4 h-4" /> You're subscribed!</div>
              ) : (
                <>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                    className="px-4 py-2.5 rounded-sm w-56 text-sm bg-dark-975 border border-dark-700 text-white placeholder:text-dark-500 focus:outline-none focus:border-blue-500/40" />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-all flex items-center gap-2">
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
