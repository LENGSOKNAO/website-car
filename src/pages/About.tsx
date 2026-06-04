import { motion } from 'framer-motion'
import { Users, Target, Award } from 'lucide-react'

const stats = [
  { label: 'Vehicles Sold', value: '10,000+' },
  { label: 'Verified Dealers', value: '500+' },
  { label: 'Happy Customers', value: '15,000+' },
  { label: 'Years in Business', value: '12+' },
]

const team = [
  { name: 'Alex Rivera', role: 'CEO & Founder', avatar: 'AR' },
  { name: 'Sarah Chen', role: 'Head of Operations', avatar: 'SC' },
  { name: 'Mike Johnson', role: 'Chief Technology Officer', avatar: 'MJ' },
  { name: 'Emily Davis', role: 'VP of Sales', avatar: 'ED' },
]

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">About DriveMarket</h1>
          <p className="mt-4 text-lg text-dark-300 max-w-2xl mx-auto">We're on a mission to make car buying transparent, fair, and enjoyable for everyone.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl font-bold text-white mt-2">Changing the Way People Buy Cars</h2>
            <p className="text-dark-200 mt-4 leading-relaxed">
              Founded in 2014, DriveMarket started with a simple idea: buying a car should be exciting, not stressful. 
              We built a platform that puts transparency, trust, and convenience at the center of every transaction.
            </p>
            <p className="text-dark-200 mt-4 leading-relaxed">
              Today, we're one of the fastest-growing automotive marketplaces, connecting millions of buyers with thousands of trusted dealers across the country.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-dark-900 rounded-xl p-6 text-center">
                <p className="text-3xl font-extrabold text-blue-400">{stat.value}</p>
                <p className="text-sm text-dark-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Transparency', desc: 'No hidden fees, no surprises. Every detail of every vehicle is disclosed upfront.' },
              { icon: Users, title: 'Community First', desc: 'We build trust through verified reviews, secure payments, and dedicated support.' },
              { icon: Award, title: 'Excellence', desc: 'From our platform to our service, we strive for the highest standards in everything we do.' },
            ].map((v) => (
              <div key={v.title} className="p-6 rounded-xl border border-dark-800 text-center">
                <div className="w-14 h-14 bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto">
                  <v.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mt-4">{v.title}</h3>
                <p className="text-sm text-dark-300 mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Leadership Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-blue-400">
                  {t.avatar}
                </div>
                <p className="font-semibold text-white mt-3">{t.name}</p>
                <p className="text-sm text-dark-300">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
