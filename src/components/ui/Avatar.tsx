import { cn, getInitials, imageUrl } from '@/lib/utils'
import ImageWithLoading from '@/components/ui/ImageWithLoading'

interface AvatarProps {
  src?: string | null; name: string; size?: 'sm' | 'md' | 'lg'; className?: string; status?: 'online' | 'offline'
}

const sizes: Record<string, string> = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
const sizeNums: Record<string, number> = { sm: 32, md: 40, lg: 56 }

export default function Avatar({ src, name, size = 'md', className, status }: AvatarProps) {
  if (src) {
    return (
      <div className="relative inline-flex">
        <ImageWithLoading
          src={imageUrl(src)}
          alt={name}
          className={cn('rounded-full ring-2 ring-dark-800', sizes[size], className)}
          width={sizeNums[size]}
          height={sizeNums[size]}
        />
        {status && <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-dark-975', status === 'online' ? 'bg-emerald-500' : 'bg-dark-500')} />}
      </div>
    )
  }
  return (
    <div className="relative inline-flex">
      <div className={cn('rounded-full bg-dark-800 text-dark-200 flex items-center justify-center font-semibold ring-2 ring-dark-800', sizes[size], className)}>
        {getInitials(name)}
      </div>
      {status && <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-dark-975', status === 'online' ? 'bg-emerald-500' : 'bg-dark-500')} />}
    </div>
  )
}
