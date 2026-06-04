import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium'
  size?: 'sm' | 'md'
  className?: string
}

const variants: Record<string, string> = {
  default: 'bg-blue-50 text-blue-800',
  success: 'bg-green-50 text-green-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
  premium: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200',
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm', variants[variant], className)}>
      {children}
    </span>
  )
}
