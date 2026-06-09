import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: { value: string; label: string }[]; placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-500">{label}</label>}
        <div className="relative">
          <select
            ref={ref} id={selectId}
            className={cn(
              'block w-full rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 appearance-none',
              'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30',
              error ? 'border-red-500/50' : 'border-gray-200 hover:border-gray-300',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          >
            {placeholder && <option value="" className="bg-white">{placeholder}</option>}
            {options.map((opt) => <option key={opt.value} value={opt.value} className="bg-white">{opt.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
export default Select
