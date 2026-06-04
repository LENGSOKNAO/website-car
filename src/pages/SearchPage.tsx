import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import CarCard from '@/components/car/CarCard'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { CarListing } from '@/lib/types'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const [listings, setListings] = useState<CarListing[]>([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [input, setInput] = useState(searchParams.get('q') || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const query = searchParams.get('q') || ''

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (!query) { setListings([]); setLoading(false); return }
    setLoading(true)
    api.listings({ search: query, per_page: 12, sort: 'created_at:desc' })
      .then((res) => { const d = res.data?.data || res.data || []; setListings(Array.isArray(d) ? d : []) })
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [query])

  useEffect(() => {
    if (isAuthenticated) {
      api.savedListings().then((res) => { const d = res.data || []; const ids = new Set<string>(); (Array.isArray(d) ? d : []).forEach((s: any) => ids.add(s.listing_id)); setSavedIds(ids) }).catch(() => {})
    }
  }, [isAuthenticated])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) {
      const params = new URLSearchParams()
      params.set('q', input.trim())
      setSearchParams(params)
    }
  }

  function clearSearch() {
    setInput('')
    setSearchParams({})
    inputRef.current?.focus()
  }

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-white">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search make, model, or keyword..."
              className="w-full pl-12 pr-12 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
            {input && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="mt-3 flex items-center justify-between">
          {query && (
            <p className="text-xs text-gray-500">
              {loading ? 'Searching...' : `${listings.length} result${listings.length !== 1 ? 's' : ''} for "${query}"`}
            </p>
          )}
          {query && listings.length > 0 && (
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
          )}
        </div>

        <div className="mt-6">
          {!query ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <h2 className="text-xl font-semibold text-gray-900">Search Vehicles</h2>
              <p className="text-gray-500 text-sm mt-1">Type a make, model, or keyword to find your perfect car.</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-sm bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((listing, i) => (
                <CarCard key={listing.id} listing={listing} index={i} isSaved={savedIds.has(listing.id)} onSave={handleSave} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900">No results found</h3>
              <p className="text-gray-500 text-sm mt-1">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
