type ClassValue = string | number | boolean | undefined | null

export function cn(...inputs: (ClassValue | ClassValue[])[]): string {
  const classes: string[] = []
  for (const input of inputs) {
    if (Array.isArray(input)) {
      for (const v of input) {
        if (v && typeof v === 'string') classes.push(v)
      }
    } else if (input && typeof input === 'string') {
      classes.push(input)
    }
  }
  return classes.join(' ')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString()} mi`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateRelative(date: string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const API_BASE = 'https://store-car-seven.vercel.app'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function imageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (UUID_RE.test(url)) return `/api/files/${url}`
  if (url.startsWith('/api/')) return url
  if (url.startsWith('/')) return `${API_BASE}${url}`
  return `${API_BASE}/${url}`
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    read: 'bg-gray-100 text-gray-600',
    replied: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-400',
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    countered: 'bg-purple-100 text-purple-700',
    in_stock: 'bg-green-100 text-green-700',
    out_of_stock: 'bg-red-100 text-red-700',
    coming_soon: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}
