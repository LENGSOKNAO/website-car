import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Calculator, ArrowRight, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { MILEAGE_OPTIONS } from '@/lib/constants'

export default function TradeIn() {
  const [step, setStep] = useState<'estimate' | 'details' | 'done'>('estimate')
  const [estimate, setEstimate] = useState<number | null>(null)
  const [form, setForm] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: '',
  })

  function calculateEstimate() {
    const year = Number(form.year)
    const mileage = Number(form.mileage)
    if (!year || !form.make || !form.model || !mileage) return
    const basePrice = 25000
    const ageDeduction = Math.max(0, (2026 - year) * 1500)
    const mileageDeduction = Math.max(0, mileage * 0.05)
    const conditionMultiplier = form.condition === 'excellent' ? 1.1 : form.condition === 'good' ? 1 : form.condition === 'fair' ? 0.85 : 0.7
    const est = Math.max(0, (basePrice - ageDeduction - mileageDeduction) * conditionMultiplier)
    setEstimate(Math.round(est))
    setStep('details')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-white">Trade-In Your Car</h1>
            <p className="mt-4 text-lg text-dark-300">Get a real-time estimate for your vehicle. Trade it in toward your next purchase.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-dark-975 rounded-xl border border-dark-800 p-6 sm:p-8">
          {step === 'estimate' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Get Your Instant Estimate</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Year" type="number" placeholder="2020" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
                <Input label="Make" placeholder="Toyota" value={form.make} onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))} />
                <Input label="Model" placeholder="Camry" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
                <Select label="Mileage" placeholder="Select mileage" options={MILEAGE_OPTIONS.map(m => ({ value: m.value, label: m.label }))} value={form.mileage} onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))} />
                <Select label="Condition" placeholder="Select condition" options={[
                  { value: 'excellent', label: 'Excellent' },
                  { value: 'good', label: 'Good' },
                  { value: 'fair', label: 'Fair' },
                  { value: 'poor', label: 'Poor' },
                ]} value={form.condition} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} />
              </div>
              <Button onClick={calculateEstimate} className="w-full justify-center" size="lg">
                Get Estimate <Calculator className="w-5 h-5" />
              </Button>
            </div>
          )}

          {step === 'details' && estimate !== null && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto">
                  <DollarSign className="w-10 h-10 text-green-400" />
                </div>
                <p className="text-dark-300 mt-4 text-lg">Estimated Trade-In Value</p>
                <p className="text-5xl font-extrabold text-green-400 mt-2">${estimate.toLocaleString()}</p>
                <p className="text-sm text-dark-400 mt-2">Based on {form.year} {form.make} {form.model}</p>
              </div>
              <hr className="border-dark-800" />
              <form onSubmit={(e) => { e.preventDefault(); setStep('done') }} className="space-y-4">
                <h3 className="font-semibold text-white">Schedule a trade-in appointment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="John Doe" required />
                  <Input label="Email" type="email" placeholder="john@example.com" required />
                  <Input label="Phone" type="tel" placeholder="(555) 123-4567" required />
                  <Input label="Preferred Date" type="date" required />
                </div>
                <Button type="submit" className="w-full justify-center">
                  Submit Trade-In <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-10 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Trade-In Submitted!</h2>
              <p className="text-dark-300 mt-2">We'll contact you within 24 hours to confirm your appointment and finalize the appraisal.</p>
              <Button onClick={() => { setStep('estimate'); setEstimate(null); setForm({ year: '', make: '', model: '', mileage: '', condition: '' }) }} variant="secondary" className="mt-6">
                Start Over
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
