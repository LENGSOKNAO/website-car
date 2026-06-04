import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; hint?: string }
 
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-800">{label}</label>}
        <input
          ref={ref} id={inputId}
          className={cn(
            'block w-full rounded-sm border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-500',
            'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30',
            error ? 'border-red-500/50' : 'border-gray-300 hover:border-gray-400',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
