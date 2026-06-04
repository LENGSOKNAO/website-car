import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white">Contact Us</h1>
          <p className="mt-4 text-lg text-dark-300">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Get in Touch</h2>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: 'Visit Us', value: '123 Auto Street, Suite 100\nNew York, NY 10001' },
                { icon: Phone, label: 'Call Us', value: '(555) 123-4567' },
                { icon: Mail, label: 'Email', value: 'support@drivemarket.com' },
                { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9AM - 8PM\nSat-Sun: 10AM - 6PM' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.label}</p>
                    <p className="text-sm text-dark-300 whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-dark-975 border border-dark-800 rounded-xl p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-dark-300 mt-2">We'll get back to you within 24 hours.</p>
                  <Button variant="secondary" onClick={() => setSubmitted(false)} className="mt-6">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Send a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" required />
                    <Input label="Last Name" placeholder="Doe" required />
                    <Input label="Email" type="email" placeholder="john@example.com" required />
                    <Input label="Phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-1.5">Subject</label>
                    <select className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white">
                      <option>General Inquiry</option>
                      <option>Sales Question</option>
                      <option>Support Request</option>
                      <option>Dealer Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-1.5">Message</label>
                    <textarea rows={4} placeholder="Tell us how we can help..." className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400" required />
                  </div>
                  <Button type="submit" className="w-full justify-center">
                    Send Message <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
