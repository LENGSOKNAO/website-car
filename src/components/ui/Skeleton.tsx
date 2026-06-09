import { cn } from '@/lib/utils'

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer rounded-xl', className)} />
}
