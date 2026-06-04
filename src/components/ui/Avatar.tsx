import { useState } from 'react'
import { cn, getInitials } from '@/lib/utils'
import Skeleton from '@/components/ui/Skeleton'

interface AvatarProps {
  src?: string | null; name: string; size?: 'sm' | 'md' | 'lg'; className?: string; status?: 'online' | 'offline'
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }

export default function Avatar({ src, name, size = 'md', className, status }: AvatarProps) {
  const [loaded, setLoaded] = useState(false)
  const [erred, setErred] = useState(false)

  if (src && !erred) {
    return (
      <div className="relative inline-flex">
        {!loaded && (
          <Skeleton className={cn('rounded-full', sizes[size])} />
        )}
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setErred(true)}
          className={cn('rounded-full object-cover ring-2 ring-dark-800', sizes[size], className, !loaded && 'hidden')}
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
