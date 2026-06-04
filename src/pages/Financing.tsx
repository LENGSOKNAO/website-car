import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, FileText, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function Financing() {
  const [form, setForm] = useState({
    vehiclePrice: '35000',
    downPayment: '7000',
    tradeInValue: '0',
    interestRate: '6.9',
    loanTerm: '60',
  })
  const [submitted, setSubmitted] = useState(false)

  const price = Number(form.vehiclePrice) || 0
  const down = Number(form.downPayment) || 0
  const trade = Number(form.tradeInValue) || 0
  const rate = (Number(form.interestRate) || 0) / 100 / 12
  const term = Number(form.loanTerm) || 1
  const loanAmount = price - down - trade
  const monthly = loanAmount > 0
    ? (loanAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    : 0

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-white">Auto Financing</h1>
            <p className="mt-4 text-lg text-dark-300">Get pre-approved in minutes with competitive rates from top lenders.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2 bg-dark-975 rounded-xl border border-dark-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Payment Calculator</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Vehicle Price" type="number" value={form.vehiclePrice} onChange={(e) => update('vehiclePrice', e.target.value)} />
              <Input label="Down Payment" type="number" value={form.downPayment} onChange={(e) => update('downPayment', e.target.value)} />
              <Input label="Trade-In Value" type="number" value={form.tradeInValue} onChange={(e) => update('tradeInValue', e.target.value)} />
              <Input label="Interest Rate (%)" type="number" step="0.1" value={form.interestRate} onChange={(e) => update('interestRate', e.target.value)} />
                <Select
                  label="Loan Term"
                  options={[
                    { value: '36', label: '36 months' },
                    { value: '48', label: '48 months' },
                    { value: '60', label: '60 months' },
                    { value: '72', label: '72 months' },
                    { value: '84', label: '84 months' },
                  ]}
                  value={form.loanTerm}
                  onChange={(e) => update('loanTerm', e.target.value)}
                />
            </div>
          </div>

          {/* Results */}
          <div className="bg-dark-975 rounded-xl border border-dark-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Your Estimate</h2>
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-dark-300">Estimated Monthly Payment</p>
                <p className="text-4xl font-extrabold text-blue-400 mt-1">
                  ${monthly > 0 ? Math.round(monthly).toLocaleString() : '0'}
                </p>
              </div>
              <hr className="border-dark-800" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-dark-300">Loan Amount</span><span className="font-semibold text-white">${loanAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Interest Rate</span><span className="font-semibold text-white">{form.interestRate}%</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Term</span><span className="font-semibold text-white">{form.loanTerm} months</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Total Interest</span><span className="font-semibold text-white">${monthly > 0 ? Math.round(monthly * term - loanAmount).toLocaleString() : '0'}</span></div>
                <div className="flex justify-between pt-2 border-t border-dark-800"><span className="text-dark-200 font-semibold">Total Cost</span><span className="font-bold text-white">${monthly > 0 ? Math.round(monthly * term).toLocaleString() : '0'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-approval form */}
        <div className="mt-8 bg-dark-975 rounded-xl border border-dark-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Get Pre-Approved</h2>
          </div>
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
              <p className="text-dark-300 mt-2">We'll review your information and contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input label="Full Name" placeholder="John Doe" required />
              <Input label="Email" type="email" placeholder="john@example.com" required />
              <Input label="Phone" type="tel" placeholder="(555) 123-4567" required />
              <Input label="Annual Income" type="number" placeholder="75000" />
              <Button type="submit" className="sm:col-span-2 lg:col-span-4 mt-2">Submit Application</Button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  )
}
