import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function TestDrive() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white">Schedule a Test Drive</h1>
          <p className="mt-4 text-lg text-dark-300">Experience the car firsthand. Book your test drive today.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="bg-dark-975 rounded-xl border border-dark-800 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Test Drive Scheduled!</h2>
            <p className="text-dark-300 mt-2">We've sent a confirmation to your email. See you soon!</p>
            <Button variant="secondary" onClick={() => setSubmitted(false)} className="mt-6">Book Another</Button>
          </div>
        ) : (
          <div className="bg-dark-975 rounded-xl border border-dark-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Car className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Book Your Test Drive</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" required />
                <Input label="Last Name" placeholder="Doe" required />
                <Input label="Email" type="email" placeholder="john@example.com" required />
                <Input label="Phone" type="tel" placeholder="(555) 123-4567" required />
              </div>
              <Input label="Vehicle of Interest" placeholder="e.g. 2024 Toyota Camry" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Preferred Date" type="date" required />
                <Select label="Preferred Time" placeholder="Select time" options={[
                  { value: '09:00', label: '9:00 AM' },
                  { value: '10:00', label: '10:00 AM' },
                  { value: '11:00', label: '11:00 AM' },
                  { value: '12:00', label: '12:00 PM' },
                  { value: '13:00', label: '1:00 PM' },
                  { value: '14:00', label: '2:00 PM' },
                  { value: '15:00', label: '3:00 PM' },
                  { value: '16:00', label: '4:00 PM' },
                  { value: '17:00', label: '5:00 PM' },
                ]} />
              </div>
              <Input label="Location" placeholder="New York, NY" />
              <Button type="submit" className="w-full justify-center" size="lg">
                Schedule Test Drive
              </Button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  )
}
