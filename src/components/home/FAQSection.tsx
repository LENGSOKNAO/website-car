import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'How does the vehicle verification process work?', a: 'Every car on DriveMarket goes through a multi-point inspection before it can be listed. Our team verifies the vehicle identification number (VIN) against national databases, checks for accident history through Carfax and AutoCheck, confirms odometer readings are accurate, and validates that all liens are cleared. Sellers must provide title documentation and high-resolution photos. Only after passing all these checks does a listing go live.' },
  { q: 'What financing options are available and what rates can I expect?', a: 'We partner with over 15 lenders including Chase, Capital One, Wells Fargo, and local credit unions to offer competitive rates. Current APRs start at 3.99% for qualified buyers with excellent credit (720+), 5.99-8.99% for good credit (660-719), and 9.99-14.99% for fair credit (600-659). Terms range from 36 to 84 months. You can get pre-approved online in under 5 minutes with a soft credit pull that won\'t impact your score. We also offer special financing for first-time buyers and recent graduates.' },
  { q: 'Can I return a car after purchase?', a: "Yes — we stand behind every vehicle with a 7-day / 300-mile return guarantee. If you're not completely satisfied, you can return the car for a full refund of the purchase price. You're responsible for the condition of the vehicle (normal wear and tear expected) and return shipping costs if applicable. A few exclusions apply: vehicles over 100,000 miles, motorcycles, and commercial fleet vehicles are not eligible. The return window starts from the moment you take delivery." },
  { q: 'How does nationwide delivery work and what does it cost?', a: 'We coordinate with a network of vetted transport carriers to deliver your vehicle anywhere in the continental US. Delivery within 200 miles of the seller is always free. For distances beyond 200 miles, pricing starts at $0.85 per mile and is capped at $1,200 for coast-to-coast delivery (e.g., Los Angeles to New York). You choose between open transport (standard, most affordable) and enclosed transport (premium, for high-value vehicles). Every shipment includes real-time GPS tracking and a estimated 3-7 day delivery window.' },
  { q: 'Is my personal and payment information secure?', a: 'Absolutely. DriveMarket is SOC 2 Type II certified and uses 256-bit AES encryption for all data in transit and at rest. We are PCI DSS Level 1 compliant for payment processing, meaning we meet the highest standards set by Visa, Mastercard, and Amex. Your financial information is never stored on our servers — it is tokenized and processed directly through our banking partners. We also offer two-factor authentication for your account and will never sell or share your personal data with third parties without your explicit written consent.' },
  { q: 'What happens if the car I buy has issues after delivery?', a: 'All vehicles on our platform come with a minimum 90-day / 4,000-mile limited powertrain warranty provided by the seller at no extra cost. For an additional fee, you can upgrade to a comprehensive bumper-to-bumper warranty covering electronics, AC, suspension, and more (starting at $1,299 for 3-year/36,000-mile coverage). If a major mechanical issue arises within the first 30 days, we mediate between you and the seller to ensure a fair resolution, including covering repair costs at an approved shop.' },
  { q: 'Can I trade in my current vehicle toward a purchase?', a: 'Yes, and the process takes less than 10 minutes. Enter your vehicle\'s make, model, year, mileage, and condition on our trade-in page. You\'ll receive an instant, obligation-free offer that\'s valid for 7 days. That offer can be applied directly as a credit toward any vehicle purchase on our platform. We handle all the paperwork — DMV transfer, payoff of existing liens (up to $50,000), and shipping coordination. In most cases, you can drop off your old car and pick up your new one on the same day.' },
  { q: 'How do test drives work for online purchases?', a: 'We offer three ways to test drive: (1) In-person at the seller\'s location — schedule a time that works for you through our platform. (2) Mobile test drive — the seller brings the car to your home or office within a 50-mile radius. (3) Virtual walkaround — a live video tour where the seller walks you through the car inside and out, starts the engine, and demonstrates all features. For mobile and in-person test drives, you have up to 60 minutes alone with the vehicle. No commitment required.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">Everything you need to know about buying a car on DriveMarket. Real answers from our team.</p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.04 }}
              className="rounded-sm border border-gray-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900 pr-8">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
