import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }

export default function Card({ children, className, hover, onClick, padding = 'md' }: CardProps) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'rounded-2xl border bg-white',
        hover ? 'border-blue-300 card-hover-blue' : 'border-blue-100',
        paddings[padding],
        onClick && 'text-left w-full cursor-pointer',
        className
      )}
    >
      {children}
    </Comp>
  )
}
