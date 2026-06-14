import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, ArrowRight, ArrowLeft, X, Star, Car, Gauge, Fuel, Cog, Hash, MapPin, Image as ImageIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { api } from '@/lib/api'
import { FUEL_TYPES, TRANSMISSIONS, CONDITIONS } from '@/lib/constants'

interface Make {
  id: string
  name: string
  models: { id: string; name: string }[]
}

interface Condition {
  id: string
  name: string
}

interface ImagePreview {
  file: File
  preview: string
}

export default function SellCar() {
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [makes, setMakes] = useState<Make[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [loading, setLoading] = useState(true)

  const [makeId, setMakeId] = useState('')
  const [modelId, setModelId] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [mileage, setMileage] = useState('')
  const [condition, setCondition] = useState('')
  const [vin, setVin] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [engineSize, setEngineSize] = useState('')
  const [color, setColor] = useState('')
  const [interiorColor, setInteriorColor] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const models = makes.find(m => m.id === makeId)?.models ?? []

  useEffect(() => {
    api.listingFormData().then(res => {
      const d = res.data
      setMakes(d.makes || [])
      setConditions(d.conditions || [])
    }).catch(() => {
      setMakes([])
      setConditions([])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setModelId('')
  }, [makeId])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    const newPreviews = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index].preview)
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    if (primaryIndex >= updated.length) {
      setPrimaryIndex(Math.max(0, updated.length - 1))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const next = () => {
    setError(null)
    setStep(s => Math.min(s + 1, totalSteps))
  }
  const prev = () => {
    setError(null)
    setStep(s => Math.max(s - 1, 1))
  }

  const validateStep1 = () => {
    if (!year || !makeId || !modelId) return 'Year, Make, and Model are required'
    return null
  }

  const validateStep2 = () => {
    if (!price) return 'Price is required'
    return null
  }

  const handleContinue = () => {
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null
    if (err) { setError(err); return }
    next()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('make_id', makeId)
      formData.append('model_id', modelId)
      formData.append('year', year)
      formData.append('price', price)
      if (originalPrice) formData.append('original_price', originalPrice)
      if (mileage) formData.append('mileage', mileage)
      if (fuelType) formData.append('fuel_type', fuelType)
      if (transmission) formData.append('transmission', transmission)
      if (engineSize) formData.append('engine_size', engineSize)
      if (color) formData.append('color', color)
      if (interiorColor) formData.append('interior_color', interiorColor)
      if (condition) formData.append('condition', condition)
      if (vin) formData.append('vin', vin)
      if (description) formData.append('description', description)
      if (location) formData.append('location', location)
      formData.append('status', 'in_stock')
      formData.append('total', '1')
      formData.append('primary_index', primaryIndex.toString())

      previews.forEach((img) => {
        formData.append('images[]', img.file)
      })

      await api.createListingFormData(formData)
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSubmitted(false)
    setError(null)
    setMakeId('')
    setModelId('')
    setYear(new Date().getFullYear().toString())
    setMileage('')
    setCondition('')
    setVin('')
    setPrice('')
    setOriginalPrice('')
    setFuelType('')
    setTransmission('')
    setEngineSize('')
    setColor('')
    setInteriorColor('')
    setLocation('')
    setDescription('')
    setPreviews([])
    setPrimaryIndex(0)
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white">Listing Submitted!</h1>
        <p className="text-dark-300 mt-3 text-lg">Our team will review your vehicle and publish it within 24 hours.</p>
        <Button onClick={resetForm} variant="secondary" className="mt-8">List Another Car</Button>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-dark-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-white">Sell Your Car</h1>
            <p className="mt-4 text-lg text-dark-300">List your vehicle and reach thousands of potential buyers. It's fast, easy, and free.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-dark-975 rounded-xl border border-dark-800 p-6 sm:p-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {['Vehicle Info', 'Details', 'Photos', 'Review'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i + 1 <= step ? 'bg-blue-600 text-white' : 'bg-dark-800 text-dark-400'
                }`}>
                  {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i + 1 <= step ? 'text-blue-400' : 'text-dark-400'}`}>{label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-900/30 border border-red-800 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Vehicle Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Year" type="number" placeholder="2024" required value={year} onChange={e => setYear(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Make *</label>
                  <select value={makeId} onChange={e => setMakeId(e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400">
                    <option value="">Select make</option>
                    {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Model *</label>
                  <select value={modelId} onChange={e => setModelId(e.target.value)} disabled={!makeId} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400 disabled:opacity-50">
                    <option value="">{makeId ? 'Select model' : 'Choose make first'}</option>
                    {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <Input label="Mileage" type="number" placeholder="25000" value={mileage} onChange={e => setMileage(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Condition *</label>
                  <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400">
                    <option value="">Select condition</option>
                    {(conditions.length ? conditions : CONDITIONS.map(c => ({ id: c.toLowerCase(), name: c }))).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <Input label="VIN" placeholder="1HGCM82633A004352" value={vin} onChange={e => setVin(e.target.value)} />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleContinue}>Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Vehicle Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Price ($)" type="number" placeholder="25000" required value={price} onChange={e => setPrice(e.target.value)} />
                <Input label="Original Price ($)" type="number" placeholder="30000" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Fuel Type</label>
                  <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400">
                    <option value="">Select fuel type</option>
                    {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Transmission</label>
                  <select value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400">
                    <option value="">Select transmission</option>
                    {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <Input label="Engine Size" placeholder="e.g. 2.5L I4" value={engineSize} onChange={e => setEngineSize(e.target.value)} />
                <Input label="Color" placeholder="e.g. White" value={color} onChange={e => setColor(e.target.value)} />
                <Input label="Interior Color" placeholder="Black" value={interiorColor} onChange={e => setInteriorColor(e.target.value)} />
                <Input label="Location" placeholder="City, State" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Description</label>
                <textarea rows={4} placeholder="Describe your vehicle's condition, features, and history..." value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-dark-800 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-dark-975 text-white placeholder-dark-400" />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prev}><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={handleContinue}>Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Upload Photos</h2>
              <p className="text-sm text-dark-300">Upload clear photos of your vehicle. High-quality images sell faster.</p>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-dark-600 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                <p className="font-semibold text-dark-200">Click to upload or drag and drop</p>
                <p className="text-sm text-dark-400 mt-1">PNG, JPG up to 10MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {previews.map((img, i) => (
                    <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-dark-700">
                      <img src={img.preview} alt={`Car photo ${i + 1}`} className="size-full object-cover" />
                      <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1.5 transition-colors group-hover:bg-black/40">
                        <button
                          type="button"
                          onClick={() => { setPrimaryIndex(i) }}
                          className={`p-1 rounded ${primaryIndex === i ? 'text-yellow-400' : 'text-white/60'} hover:text-yellow-400 transition-colors`}
                        >
                          <Star className={`size-4 ${primaryIndex === i ? 'fill-yellow-400' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="p-1 rounded text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      {primaryIndex === i && (
                        <span className="absolute bottom-1.5 left-1.5 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prev}><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={handleContinue}>Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">Review & Submit</h2>
              <div className="bg-dark-900 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-300">Year/Make/Model</span>
                  <span className="font-semibold text-white">
                    {year} {makes.find(m => m.id === makeId)?.name || ''} {models.find(m => m.id === modelId)?.name || ''}
                  </span>
                </div>
                {mileage && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Mileage</span>
                    <span className="font-semibold text-white">{Number(mileage).toLocaleString()} mi</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark-300">Price</span>
                  <span className="font-semibold text-white">${Number(price).toLocaleString()}</span>
                </div>
                {originalPrice && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Original Price</span>
                    <span className="font-semibold text-white">${Number(originalPrice).toLocaleString()}</span>
                  </div>
                )}
                {condition && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Condition</span>
                    <span className="font-semibold text-white">{condition}</span>
                  </div>
                )}
                {fuelType && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Fuel Type</span>
                    <span className="font-semibold text-white">{fuelType}</span>
                  </div>
                )}
                {transmission && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Transmission</span>
                    <span className="font-semibold text-white">{transmission}</span>
                  </div>
                )}
                {engineSize && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Engine Size</span>
                    <span className="font-semibold text-white">{engineSize}</span>
                  </div>
                )}
                {color && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Color</span>
                    <span className="font-semibold text-white">{color}</span>
                  </div>
                )}
                {interiorColor && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Interior Color</span>
                    <span className="font-semibold text-white">{interiorColor}</span>
                  </div>
                )}
                {location && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">Location</span>
                    <span className="font-semibold text-white">{location}</span>
                  </div>
                )}
                {vin && (
                  <div className="flex justify-between">
                    <span className="text-dark-300">VIN</span>
                    <span className="font-semibold text-white">{vin}</span>
                  </div>
                )}
                {description && (
                  <div className="pt-2 border-t border-dark-700">
                    <span className="text-dark-300 block mb-1">Description</span>
                    <span className="text-white text-sm">{description}</span>
                  </div>
                )}
                {previews.length > 0 && (
                  <div className="pt-2 border-t border-dark-700">
                    <span className="text-dark-300 block mb-2">Photos ({previews.length})</span>
                    <div className="flex gap-2 flex-wrap">
                      {previews.map((img, i) => (
                        <div key={i} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${primaryIndex === i ? 'border-blue-500' : 'border-dark-700'}`}>
                          <img src={img.preview} alt="" className="size-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-dark-900 border border-blue-800 rounded-xl p-4 text-sm text-blue-400">
                By submitting, you agree to our Terms of Service and confirm that all information provided is accurate.
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prev}><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">
                  {submitting ? 'Submitting...' : 'Submit Listing'} <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
