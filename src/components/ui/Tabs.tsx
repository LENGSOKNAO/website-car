import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  activeTab: string; onChange: (id: string) => void; className?: string
}

export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('inline-flex gap-1 bg-dark-900 rounded-xl p-1', className)}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={cn('relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', activeTab === tab.id ? 'text-white' : 'text-dark-400 hover:text-dark-200')}>
          {activeTab === tab.id && <motion.div layoutId="tab-dark" className="absolute inset-0 bg-dark-800 rounded-lg border border-dark-700" transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }} />}
          <span className="relative z-10 flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && <span className={cn('text-xs px-1.5 py-0.5 rounded-full', activeTab === tab.id ? 'bg-blue-900/30 text-blue-400' : 'bg-dark-800 text-dark-400')}>{tab.count}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}
