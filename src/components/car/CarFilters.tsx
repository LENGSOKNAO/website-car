import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Grid3X3, List, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CarCard from './CarCard'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { FUEL_TYPES, TRANSMISSIONS, CONDITIONS, SORT_OPTIONS, MILEAGE_OPTIONS, COLORS } from '@/lib/constants'
import type { CarListing, CarMake } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function CarFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [listings, setListings] = useState<CarListing[]>([])
  const [makes, setMakes] = useState<CarMake[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const filters = {
    search: searchParams.get('search') || '',
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    condition: searchParams.get('condition') || '',
    fuel_type: searchParams.get('fuel_type') || '',
    transmission: searchParams.get('transmission') || '',
    color: searchParams.get('color') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_year: searchParams.get('min_year') || '',
    max_year: searchParams.get('max_year') || '',
    mileage_max: searchParams.get('mileage_max') || '',
    sort: searchParams.get('sort') || 'created_at:desc',
  }

  useEffect(() => { api.makes().then((res) => { const d = res.data || []; setMakes(Array.isArray(d) ? d : []) }).catch(() => {}) }, [])
  useEffect(() => {
    setLoading(true)
    const params: Record<string, string | number | undefined | null> = { per_page: 12, sort: filters.sort || 'created_at:desc' }
    Object.entries(filters).forEach(([k, v]) => { if (v && k !== 'sort') params[k] = v })
    api.listings(params).then((res) => { const d = res.data?.data || res.data || []; setListings(Array.isArray(d) ? d : []) }).catch(() => setListings([])).finally(() => setLoading(false))
  }, [searchParams])
  useEffect(() => {
    if (isAuthenticated) { api.savedListings().then((res) => { const d = res.data || []; const ids = new Set<string>(); (Array.isArray(d) ? d : []).forEach((s: any) => ids.add(s.listing_id)); setSavedIds(ids) }).catch(() => {}) }
  }, [isAuthenticated])

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value); else params.delete(key)
    if (key !== 'sort') params.set('page', '1')
    setSearchParams(params)
  }
  function clearFilters() { setSearchParams({}) }

  async function handleSave(listingId: string) {
    if (!isAuthenticated) return
    try {
      if (savedIds.has(listingId)) {
        const savedRes = await api.savedListings()
        const found = (Array.isArray(savedRes.data) ? savedRes.data : []).find((s: any) => s.listing_id === listingId)
        if (found) await api.unsaveListing(found.id)
        savedIds.delete(listingId); setSavedIds(new Set(savedIds))
      } else {
        await api.saveListing(listingId); setSavedIds(new Set([...savedIds, listingId]))
      }
    } catch {}
  }

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && k !== 'sort' && k !== 'search').length
  const selectedModels = filters.make ? makes.find((m) => m.id === filters.make)?.models || [] : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Browse Cars</h1>
          <p className="text-dark-500 text-sm mt-0.5">{loading ? 'Searching...' : `${listings.length} vehicle${listings.length !== 1 ? 's' : ''} found`}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-500" />
            <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-dark-800 rounded-xl text-sm bg-dark-975 text-white placeholder:text-dark-500 focus:outline-none focus:border-blue-500/40 transition-all" />
          </div>
          <Select options={SORT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="w-36" />
          <div className="hidden sm:flex border border-dark-800 rounded-xl overflow-hidden">
            <button onClick={() => setLayout('grid')} className={cn('p-2 transition-colors', layout === 'grid' ? 'bg-dark-800 text-blue-400' : 'text-dark-500 hover:text-dark-300')}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setLayout('list')} className={cn('p-2 transition-colors', layout === 'list' ? 'bg-dark-800 text-blue-400' : 'text-dark-500 hover:text-dark-300')}><List className="w-4 h-4" /></button>
          </div>
          <Button variant={showFilters || activeFilterCount > 0 ? 'primary' : 'secondary'} onClick={() => setShowFilters(!showFilters)} className="relative">
            <Filter className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-dark-800 bg-dark-975 p-5 mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Select label="Make" placeholder="All Makes" options={makes.map(m => ({ value: m.id, label: m.name }))} value={filters.make} onChange={(e) => updateFilter('make', e.target.value)} />
                <Select label="Model" placeholder="All Models" options={selectedModels.map(m => ({ value: m.id, label: m.name }))} value={filters.model} onChange={(e) => updateFilter('model', e.target.value)} disabled={!filters.make} />
                <Select label="Condition" placeholder="All" options={CONDITIONS.map(c => ({ value: c.toLowerCase(), label: c }))} value={filters.condition} onChange={(e) => updateFilter('condition', e.target.value)} />
                <Select label="Fuel" placeholder="All" options={FUEL_TYPES.map(f => ({ value: f, label: f }))} value={filters.fuel_type} onChange={(e) => updateFilter('fuel_type', e.target.value)} />
                <Select label="Transmission" placeholder="All" options={TRANSMISSIONS.map(t => ({ value: t, label: t }))} value={filters.transmission} onChange={(e) => updateFilter('transmission', e.target.value)} />
                <Select label="Color" placeholder="All" options={COLORS.map(c => ({ value: c.toLowerCase(), label: c }))} value={filters.color} onChange={(e) => updateFilter('color', e.target.value)} />
                <Select label="Max Mileage" placeholder="No Limit" options={MILEAGE_OPTIONS.map(m => ({ value: m.value, label: m.label }))} value={filters.mileage_max} onChange={(e) => updateFilter('mileage_max', e.target.value)} />
                <div><label className="block text-xs font-medium text-dark-300 mb-1.5">Min Price</label><input type="number" placeholder="$0" value={filters.min_price} onChange={(e) => updateFilter('min_price', e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2 text-xs bg-dark-975 text-white placeholder:text-dark-500 focus:outline-none focus:border-blue-500/40" /></div>
                <div><label className="block text-xs font-medium text-dark-300 mb-1.5">Max Price</label><input type="number" placeholder="$999k" value={filters.max_price} onChange={(e) => updateFilter('max_price', e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2 text-xs bg-dark-975 text-white placeholder:text-dark-500 focus:outline-none focus:border-blue-500/40" /></div>
                <div><label className="block text-xs font-medium text-dark-300 mb-1.5">Min Year</label><input type="number" placeholder="2020" value={filters.min_year} onChange={(e) => updateFilter('min_year', e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2 text-xs bg-dark-975 text-white placeholder:text-dark-500 focus:outline-none focus:border-blue-500/40" /></div>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="mt-4 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}
        </div>
      ) : listings.length > 0 ? (
        <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
          {listings.map((listing, i) => (
            <CarCard key={listing.id} listing={listing} layout={layout} index={i} isSaved={savedIds.has(listing.id)} onSave={handleSave} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <Search className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <h3 className="text-lg font-medium text-dark-300">No vehicles found</h3>
          <p className="text-dark-500 text-sm mt-1">Try adjusting your filters.</p>
          {activeFilterCount > 0 && <button onClick={clearFilters} className="mt-4 text-sm text-blue-400 hover:text-blue-300">Clear filters</button>}
        </div>
      )}
    </div>
  )
}
