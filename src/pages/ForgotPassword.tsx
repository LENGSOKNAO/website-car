import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate sending reset email
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">Reset Password</h1>
          <p className="text-dark-300 mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-dark-975 p-8 rounded-xl border border-dark-800">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Check Your Email</h2>
              <p className="text-dark-300 mt-2 text-sm">We've sent a password reset link to {email}</p>
              <Link to="/login" className="inline-block mt-6 text-blue-400 font-semibold hover:underline">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              <Button type="submit" loading={loading} className="w-full justify-center">Send Reset Link</Button>
              <p className="text-center text-sm text-dark-300">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-400 font-semibold hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
