import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FUEL_TYPES, TRANSMISSIONS, CONDITIONS, COLORS } from '@/lib/constants'

export default function SellCar() {
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [submitted, setSubmitted] = useState(false)

  const next = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white">Listing Submitted!</h1>
        <p className="text-dark-300 mt-3 text-lg">Our team will review your vehicle and publish it within 24 hours.</p>
        <Button onClick={() => { setStep(1); setSubmitted(false) }} variant="secondary" className="mt-8">List Another Car</Button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-white">Sell Your Car</h1>
            <p className="mt-4 text-lg text-dark-300">List your vehicle and reach thousands of potential buyers. It's fast, easy, and free.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-dark-975 rounded-xl border border-dark-800 p-6 sm:p-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {['Vehicle Info', 'Details', 'Photos', 'Review'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i + 1 <= step ? 'bg-blue-600 text-white' : 'bg-dark-800 text-dark-400'
                }`}>
                  {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i + 1 <= step ? 'text-blue-400' : 'text-dark-400'}`}>{label}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Vehicle Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Year" type="number" placeholder="2024" required />
                <Input label="Make" placeholder="e.g. Toyota" required />
                <Input label="Model" placeholder="e.g. Camry" required />
                <Input label="Mileage" type="number" placeholder="25000" required />
                <Select label="Condition" placeholder="Select condition" options={CONDITIONS.map(c => ({ value: c.toLowerCase(), label: c }))} />
                <Input label="VIN" placeholder="1HGCM82633A004352" />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={next}>Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Vehicle Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Price ($)" type="number" placeholder="25000" required />
                <Input label="Original Price ($)" type="number" placeholder="30000" />
                <Select label="Fuel Type" placeholder="Select" options={FUEL_TYPES.map(f => ({ value: f, label: f }))} />
                <Select label="Transmission" placeholder="Select" options={TRANSMISSIONS.map(t => ({ value: t, label: t }))} />
                <Input label="Engine Size" placeholder="e.g. 2.5L I4" />
                <Select label="Color" placeholder="Select" options={COLORS.map(c => ({ value: c, label: c }))} />
                <Input label="Interior Color" placeholder="Black" />
                <Input label="Location" placeholder="City, State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Description</label>
                <textarea rows={4} placeholder="Describe your vehicle's condition, features, and history..." className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400" />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prev}><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={next}>Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Upload Photos</h2>
              <p className="text-sm text-dark-300">Upload clear photos of your vehicle. High-quality images sell faster.</p>
              <div className="border-2 border-dashed border-dark-600 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                <p className="font-semibold text-dark-200">Click to upload or drag and drop</p>
                <p className="text-sm text-dark-400 mt-1">PNG, JPG up to 10MB each</p>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-dark-900 rounded-xl border border-dashed border-dark-600 flex items-center justify-center text-sm text-dark-400">
                    Photo {i}
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prev}><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={next}>Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Review & Submit</h2>
              <div className="bg-dark-900 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-dark-300">Year/Make/Model</span><span className="font-semibold text-white">2024 Toyota Camry</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Mileage</span><span className="font-semibold text-white">25,000 mi</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Price</span><span className="font-semibold text-white">$25,000</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Condition</span><span className="font-semibold text-white">Excellent</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Fuel Type</span><span className="font-semibold text-white">Gasoline</span></div>
                <div className="flex justify-between"><span className="text-dark-300">Transmission</span><span className="font-semibold text-white">Automatic</span></div>
              </div>
              <div className="bg-dark-900 border border-blue-800 rounded-xl p-4 text-sm text-blue-400">
                By submitting, you agree to our Terms of Service and confirm that all information provided is accurate.
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prev}><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={() => setSubmitted(true)} className="bg-green-600 hover:bg-green-700">Submit Listing <CheckCircle className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
