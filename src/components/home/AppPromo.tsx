import { motion } from 'framer-motion'
import { Smartphone, QrCode, Download, Check } from 'lucide-react'

const features = [
  'Real-time inventory updates',
  'Instant financing approval',
  'Secure in-app messaging',
  'One-tap test drive scheduling',
]

export default function AppPromo() {
  return (
    <section className="relative overflow-hidden bg-dark-975 border-t border-dark-800">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="w-12 h-1 rounded-full mb-5 bg-white" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-white/70">
              Mobile App
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Your Dealership,
              <br />
              <span className="text-blue-400">In Your Pocket</span>
            </h2>
            <p className="mt-4 text-sm text-dark-300/80 max-w-md leading-relaxed">
              Browse, compare, and purchase from anywhere. Our mobile app puts the full DriveMarket experience in the palm of your hand.
            </p>

            <ul className="mt-6 space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-dark-300">
                  <span className="w-5 h-5 rounded-full bg-blue-600/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-blue-400" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-sm bg-dark-900 border border-dark-700 hover:bg-dark-800 transition-colors group">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-dark-400">Download on the</p>
                  <p className="text-xs font-medium text-white">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-2.5 px-5 py-3 rounded-sm bg-dark-900 border border-dark-700 hover:bg-dark-800 transition-colors group">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-dark-400">Get it on</p>
                  <p className="text-xs font-medium text-white">Google Play</p>
                </div>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-sm bg-dark-900 border border-dark-700 hover:bg-dark-800 transition-colors group">
                <QrCode className="w-5 h-5 text-white" />
                <span className="text-xs font-medium text-white">Scan QR</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-64 h-[500px] rounded-sm border-4 border-dark-700 bg-dark-900 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-dark-700 rounded-b-xl z-10" />
              <div className="h-full bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 p-5 pt-10">
                <div className="w-8 h-1 rounded-full mb-6 bg-blue-500" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-1">DriveMarket</p>
                <p className="text-lg font-bold text-white leading-tight">Find Your<br />Perfect Drive</p>
                <div className="mt-5 space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-2.5 p-2.5 rounded-sm bg-dark-800/60">
                      <div className="w-8 h-8 rounded-sm bg-dark-700 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-2 w-20 rounded bg-dark-700" />
                        <div className="h-1.5 w-14 rounded bg-dark-800 mt-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-sm bg-blue-600/15 border border-blue-500/20">
                  <p className="text-[10px] font-semibold text-blue-400">Featured</p>
                  <p className="text-xs text-white mt-0.5">2025 Tesla Model 3</p>
                  <p className="text-[10px] text-blue-300 mt-0.5">$42,990</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
