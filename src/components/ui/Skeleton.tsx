import { cn } from '@/lib/utils'

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-gradient-to-r from-dark-800 via-dark-800/50 to-dark-800 animate-shimmer rounded-xl', className)} />
}
