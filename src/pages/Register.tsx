import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, BadgeDollarSign, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [form, setForm] = useState({ full_name: '', email: '', password: '', password_confirmation: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await register({ ...form, role })
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-sm flex items-center justify-center mx-auto mb-4">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join DriveMarket today</p>
        </div>

        <div className="relative flex bg-gray-100 rounded-sm p-1 mb-6">
          <div
            className={`absolute inset-y-1 w-1/2 rounded-sm transition-all duration-300 ease-out ${
              role === 'buyer' ? 'left-1 shadow-sm' : 'left-[calc(50%-0.125rem)]'
            } bg-white`}
          />
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
              role === 'buyer' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Car className={`w-4 h-4 ${role === 'buyer' ? 'text-blue-600' : 'text-gray-400'}`} />
            Find a Car
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
              role === 'seller' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BadgeDollarSign className={`w-4 h-4 ${role === 'seller' ? 'text-blue-600' : 'text-gray-400'}`} />
            Selling
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-sm">{error}</div>}
          <Input label="Full Name" type="text" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="John Doe" required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all pr-10" placeholder="••••••••" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password_confirmation} onChange={(e) => update('password_confirmation', e.target.value)} className="w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all pr-10" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" loading={loading} className="w-full justify-center">Create Account</Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
