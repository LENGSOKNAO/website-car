import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Fuel, Gauge, Calendar, Settings, HardDrive, Users, Heart, MessageSquare, DollarSign, CheckCircle, Car, Phone, Mail, Share2, Flag } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import CarGallery from '@/components/car/CarGallery'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Avatar from '@/components/ui/Avatar'
import { formatPrice, cn } from '@/lib/utils'
import type { CarListing } from '@/lib/types'

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [listing, setListing] = useState<CarListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [showInquiry, setShowInquiry] = useState(false)
  const [showOffer, setShowOffer] = useState(false)
  const [inquiryMsg, setInquiryMsg] = useState('')
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [saved, setSaved] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.listing(id)
      .then((res) => setListing(res.data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (isAuthenticated) {
      api.savedListings().then((res) => {
        const data = res.data || []
        const found = (Array.isArray(data) ? data : []).find((s: any) => s.listing_id === id)
        if (found) { setSaved(true); setSavedId(found.id) }
      }).catch(() => {})
    }
  }, [isAuthenticated, id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Car className="w-16 h-16 mx-auto mb-4 text-dark-500" />
        <h2 className="text-2xl font-bold text-dark-200">Listing Not Found</h2>
        <p className="text-dark-400 mt-2">This vehicle may have been sold or removed.</p>
        <Link to="/listings" className="inline-block mt-6 text-blue-400 font-semibold hover:underline">Browse All Cars</Link>
      </div>
    )
  }

  const d = listing
  const images = d.images || []
  const priceFormatted = formatPrice(d.price)
  const originalPriceFormatted = d.original_price ? formatPrice(d.original_price) : null
  const discount = d.original_price ? Math.round((1 - d.price / d.original_price) * 100) : 0
  const isNew = d.condition?.toLowerCase() === 'new'
  const isCertified = d.condition?.toLowerCase() === 'certified pre-owned'

  async function toggleSave() {
    if (!isAuthenticated) return
    try {
      if (saved && savedId) { await api.unsaveListing(savedId); setSaved(false); setSavedId(null) }
      else { const res = await api.saveListing(d.id); setSaved(true); setSavedId(res.data?.id) }
    } catch {}
  }

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!inquiryMsg.trim()) return
    setSubmitting(true); setError('')
    try {
      await api.sendInquiry({ listing_id: d.id, message: inquiryMsg, phone_number: inquiryPhone || undefined })
      setSuccess('Inquiry sent! The seller will contact you soon.'); setInquiryMsg(''); setInquiryPhone(''); setShowInquiry(false)
    } catch (err: any) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  async function handleOffer(e: React.FormEvent) {
    e.preventDefault()
    if (!offerPrice || isNaN(Number(offerPrice))) return
    setSubmitting(true); setError('')
    try {
      await api.makeOffer({ listing_id: d.id, offered_price: Number(offerPrice) })
      setSuccess('Offer submitted! Waiting for seller response.'); setOfferPrice(''); setShowOffer(false)
    } catch (err: any) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-16">
      {/* Breadcrumb */}
      <div className="bg-dark-950 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-dark-300">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-blue-400">Browse Cars</Link>
            <span>/</span>
            <span className="text-white truncate">{d.year} {d.make?.name} {d.model?.name}</span>
          </div>
        </div>
      </div>

      {success && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-dark-900 border border-green-800 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5" /> {success}
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-dark-900 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-2">
            <CarGallery images={images} title={`${d.year} ${d.make?.name} ${d.model?.name}`} />
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {d.year} {d.make?.name} {d.model?.name}
                  </h1>
                  {d.location && (
                    <p className="flex items-center gap-1 mt-1.5 text-dark-300"><MapPin className="w-4 h-4" /> {d.location}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  {isNew && <Badge variant="success">New</Badge>}
                  {isCertified && <Badge variant="info">Certified</Badge>}
                  {d.condition === 'used' && <Badge>Used</Badge>}
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue-400">{priceFormatted}</span>
                {originalPriceFormatted && (
                  <>
                    <span className="text-xl text-dark-400 line-through">{originalPriceFormatted}</span>
                    {discount > 0 && <Badge variant="success">{discount}% off</Badge>}
                  </>
                )}
              </div>

              {d.vin && <p className="text-xs text-dark-400 mt-2">VIN: {d.vin}</p>}
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: 'Year', value: d.year },
                { icon: Gauge, label: 'Mileage', value: d.mileage ? `${d.mileage.toLocaleString()} mi` : 'N/A' },
                { icon: Fuel, label: 'Fuel Type', value: d.fuel_type || 'N/A' },
                { icon: Settings, label: 'Transmission', value: d.transmission || 'N/A' },
                { icon: HardDrive, label: 'Engine', value: d.engine_size || 'N/A' },
                { icon: Car, label: 'Color', value: d.color || 'N/A' },
                { icon: Users, label: 'Owners', value: d.owners_count !== null ? String(d.owners_count) : 'N/A' },
                { icon: CheckCircle, label: 'Condition', value: d.condition ? d.condition.charAt(0).toUpperCase() + d.condition.slice(1) : 'N/A' },
              ].map((spec) => (
                <div key={spec.label} className="bg-dark-900 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-dark-400 mb-1">
                    <spec.icon className="w-3.5 h-3.5" />
                    <span className="text-xs">{spec.label}</span>
                  </div>
                  <p className="font-semibold text-sm text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Button onClick={toggleSave} variant={saved ? 'secondary' : 'outline'} className="w-full justify-center">
                    <Heart className={cn('w-5 h-5', saved ? 'fill-red-500 text-red-500' : '')} />
                    {saved ? 'Saved' : 'Save Listing'}
                  </Button>
                  <Button onClick={() => { setShowInquiry(!showInquiry); setShowOffer(false) }} className="w-full justify-center">
                    <MessageSquare className="w-5 h-5" /> Send Inquiry
                  </Button>
                  <Button onClick={() => { setShowOffer(!showOffer); setShowInquiry(false) }} variant="outline" className="w-full justify-center">
                    <DollarSign className="w-5 h-5" /> Make an Offer
                  </Button>
                </>
              ) : (
                <div className="text-center p-5 bg-dark-900 rounded-xl">
                  <p className="text-sm text-dark-300">Sign in to save, inquire, or make an offer</p>
                  <Link to="/login" className="text-blue-400 font-semibold hover:underline text-sm mt-1 inline-block">Sign In</Link>
                </div>
              )}
            </div>

            {/* Inquiry Form */}
            {showInquiry && (
              <form onSubmit={handleInquiry} className="bg-dark-900 p-4 rounded-xl space-y-3 animate-fade-in">
                <h3 className="font-semibold text-white">Send Inquiry</h3>
                <textarea value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} placeholder="Hi, I'm interested in this vehicle. Is it still available?" rows={3} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400" required />
                <input type="tel" value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} placeholder="Your phone number (optional)" className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400" />
                <Button type="submit" loading={submitting} className="w-full justify-center">Send Inquiry</Button>
              </form>
            )}

            {/* Offer Form */}
            {showOffer && (
              <form onSubmit={handleOffer} className="bg-dark-900 p-4 rounded-xl space-y-3 animate-fade-in">
                <h3 className="font-semibold text-white">Make an Offer</h3>
                <p className="text-sm text-dark-300">Listed price: {priceFormatted}</p>
                <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Your offer amount" className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400" required />
                <Button type="submit" loading={submitting} className="w-full justify-center">Submit Offer</Button>
              </form>
            )}

            {/* Share / Report */}
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-blue-400 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-red-500 transition-colors">
                <Flag className="w-4 h-4" /> Report
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {d.description && (
          <div className="mt-8 bg-dark-975 border border-dark-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-dark-200 leading-relaxed whitespace-pre-line">{d.description}</p>
          </div>
        )}

        {/* Features */}
        {d.features && d.features.length > 0 && (
          <div className="mt-6 bg-dark-975 border border-dark-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Features & Options</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {d.features.map((f) => (
                <div key={f.id} className="flex items-center gap-2 text-sm text-dark-200">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {f.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller Card */}
        {d.seller && (
          <div className="mt-6 bg-dark-975 border border-dark-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Seller Information</h2>
            <div className="flex items-center gap-4">
              <Avatar name={d.seller.full_name} src={d.seller.avatar_url} size="lg" />
              <div className="flex-1">
                <p className="font-semibold text-white text-lg">{d.seller.dealer_name || d.seller.full_name}</p>
                {d.seller.location && <p className="text-sm text-dark-300">{d.seller.location}</p>}
                {d.seller.is_dealer && <Badge variant="info" className="mt-2">Verified Dealer</Badge>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Phone className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline"><Mail className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
