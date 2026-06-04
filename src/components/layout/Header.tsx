import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, CircleUser, Search, ChevronDown, User, List, MessageSquare, ShoppingBag, LogOut, Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { APP_NAME, BRANDS, BRAND_PAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface CatItem {
  label: string
  render: (brand: typeof BRAND_PAGES[number]) => React.ReactNode
}

const BRAND_CATEGORIES: Record<string, CatItem[]> = {
  tesla: [
    { label: 'Vehicles', render: (b) => <BrandModelsGrid brand={b} /> },
    { label: 'Energy', render: () => <StaticList items={['Solar Panels', 'Powerwall', 'Solar Roof']} /> },
    { label: 'Charging', render: () => <StaticList items={['Superchargers', 'Home Charging', 'Destination Charging']} /> },
    { label: 'Discover', render: () => <BrandLinks items={['About', 'Test Drive', 'Events']} /> },
    { label: 'Shop', render: (b) => <ShopLinks brand={b} /> },
  ],
  bmw: [
    { label: 'Vehicles', render: (b) => <BrandModelsGrid brand={b} /> },
    { label: 'Performance', render: () => <StaticList items={['M Series', 'M Performance', 'M Sport Package']} /> },
    { label: 'Charging', render: () => <StaticList items={['BMW Wallbox Pro', 'Public Charging', 'BMW Charging Card']} /> },
    { label: 'Discover', render: () => <BrandLinks items={['About', 'Test Drive', 'Events']} /> },
    { label: 'Shop', render: (b) => <ShopLinks brand={b} /> },
  ],
  bugatti: [
    { label: 'Vehicles', render: (b) => <BrandModelsGrid brand={b} /> },
    { label: 'Heritage', render: () => <StaticList items={['History', 'World Records', 'Design Philosophy']} /> },
    { label: 'Craftsmanship', render: () => <StaticList items={['Materials', 'Customization', 'Atelier']} /> },
    { label: 'Discover', render: () => <BrandLinks items={['About', 'Events', 'Gallery']} /> },
    { label: 'Shop', render: (b) => <ShopLinks brand={b} /> },
  ],
  nissan: [
    { label: 'Vehicles', render: (b) => <BrandModelsGrid brand={b} /> },
    { label: 'Performance', render: () => <StaticList items={['Specs', 'Nismo', 'Track Edition']} /> },
    { label: 'Heritage', render: () => <StaticList items={['History', 'Godzilla Legacy', 'Records']} /> },
    { label: 'Discover', render: () => <BrandLinks items={['About', 'Test Drive', 'Events']} /> },
    { label: 'Shop', render: (b) => <ShopLinks brand={b} /> },
  ],
  porsche: [
    { label: 'Vehicles', render: (b) => <BrandModelsGrid brand={b} /> },
    { label: 'Performance', render: () => <StaticList items={['Turbo Models', 'GT Series', 'GTS']} /> },
    { label: 'Charging', render: () => <StaticList items={['Porsche Charger', 'Fast Charging', 'Home Energy']} /> },
    { label: 'Discover', render: () => <BrandLinks items={['About', 'Test Drive', 'Events']} /> },
    { label: 'Shop', render: (b) => <ShopLinks brand={b} /> },
  ],
}

function StaticList({ items }: { items: string[] }) {
  return (
    <div className="space-y-1">
      {items.map(item => (
        <div key={item} className="px-3 py-2 text-sm text-[#5C5E62]">{item}</div>
      ))}
    </div>
  )
}



function BrandLinks({ items }: { items: string[] }) {
  return (
    <div className="space-y-1">
      {items.map(item => (
        <div key={item} className="px-3 py-2 text-sm text-[#5C5E62]">{item}</div>
      ))}
    </div>
  )
}

function ShopLinks({ brand }: { brand: typeof BRAND_PAGES[number] }) {
  return (
    <div className="space-y-1">
      <Link to={`/listings?make=${brand.slug}&condition=new`}
        className="block px-3 py-2 text-sm text-[#5C5E62] hover:text-black rounded-[4px] transition-colors">
        New Vehicles
      </Link>
      <Link to={`/listings?make=${brand.slug}`}
        className="block px-3 py-2 text-sm text-[#5C5E62] hover:text-black rounded-[4px] transition-colors">
        Browse All
      </Link>
    </div>
  )
}

function BrandModelsGrid({ brand }: { brand: typeof BRAND_PAGES[number] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#5C5E62] mb-3">{brand.name} Models</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
        {brand.models.map(model => (
          <Link key={model} to={`/listings?make=${brand.slug}&model=${model.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-3 py-2 text-sm text-[#5C5E62] hover:text-black rounded-[4px] transition-colors">
            {model}
          </Link>
        ))}
      </div>
      <Link to={`/listings?make=${brand.slug}`}
        className="inline-block mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium">
        View All {brand.name} →
      </Link>
    </div>
  )
}

export default function Header() {
  const { logout, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)
  const location = useLocation()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

   const handleNavigateToSettings = () => {
     navigate('/profile')
   }

  useEffect(() => { setMobileOpen(false); setHoveredCat(null) }, [location])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setHoveredCat(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const brandRoutes = BRANDS.map(b => {
    const bp = BRAND_PAGES.find(p => p.slug === b.slug)
    return { ...b, route: bp?.route || `/listings?make=${b.slug}` }
  })

  const slug = location.pathname.split('/')[1]
  const currentBrand = BRAND_PAGES.find(p => p.slug === slug || (p.slug === 'nissan' && slug === 'gtr'))
  const showSubnav = !!currentBrand

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="shrink-0">
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-[#171A20]">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {brandRoutes.map((brand) => {
                const isActive = location.pathname === brand.route
                return (
                  <Link key={brand.slug} to={brand.route}
                    className={cn(
                      'block px-4 py-1.5 text-sm font-medium rounded-[4px] transition-all duration-[333ms]',
                      isActive ? 'text-black' : 'text-[#5C5E62] hover:text-black'
                    )}
                  >
                    {brand.name === 'Nissan GT-R' ? 'GT-R' : brand.name}
                  </Link>
                )
              })}
            </div>
          </nav>

            <div className="flex items-center gap-2">
              <Link to="/search" className="p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms]">
                <Search className="w-5 h-5" />
              </Link>
{isAuthenticated && user ? (
                  <DropdownMenu className="relative">
                    <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms] rounded-[4px]">
                      <Avatar name={user.full_name || 'User'} src={user.avatar_url} size="sm" className="w-5 h-5" />
                    </DropdownMenuTrigger>
<DropdownMenuContent className="w-56 right-0 mt-2 z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                       <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/profile')}>
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/orders')}>
                          <List className="w-4 h-4 mr-2" />
                          Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/messages')}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/cart')}>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Bag
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/wishlist')}>
                          <Heart className="w-4 h-4 mr-2" />
                          Wishlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="px-3 py-2 text-red-500 hover:bg-red-50 flex items-center">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login" className="p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms] rounded-[4px]">
                    <CircleUser className="w-5 h-5" />
                  </Link>
                )}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -mr-2 text-[#5C5E62] hover:text-black transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          </div>
        </div>
      </div>

      {showSubnav && currentBrand && (
        <div className="hidden md:block border-b border-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-10">
            {BRAND_CATEGORIES[currentBrand.slug]?.map(cat => {
              const isHovered = hoveredCat === cat.label
              return (
                <div key={cat.label} className="relative h-full"
                  onMouseEnter={() => { clearTimeout(timeoutRef.current); setHoveredCat(cat.label) }}
                  onMouseLeave={() => { timeoutRef.current = setTimeout(() => setHoveredCat(null), 100) }}>
                  <button
                    className={cn(
                      'h-full px-4 text-xs font-medium transition-colors tracking-wide',
                      isHovered ? 'text-black' : 'text-[#5C5E62] hover:text-black'
                    )}
                  >
                    {cat.label}
                  </button>
                  {isHovered && (
                    <div className="fixed left-0 right-0 top-[104px] bg-white border-b border-gray-100 shadow-lg"
                      onMouseEnter={() => clearTimeout(timeoutRef.current)}
                      onMouseLeave={() => { timeoutRef.current = setTimeout(() => setHoveredCat(null), 100) }}>
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {cat.render(currentBrand)}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-0.5">
            {brandRoutes.map((brand) => {
              const page = BRAND_PAGES.find(p => p.slug === brand.slug)
              const isActive = location.pathname === brand.route
              return (
                <div key={brand.slug}>
                  <Link to={brand.route}
                    className={cn(
                      'block px-4 py-3 text-sm font-medium rounded-[4px] transition-colors',
                      isActive ? 'text-black' : 'text-[#5C5E62] hover:text-black'
                    )}>
                    {brand.name}
                  </Link>
                  {page && (
                    <div className="pl-4 pb-1 space-y-0.5">
                      {page.models.map(model => (
                        <Link key={model} to={`/listings?make=${brand.slug}&model=${model.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-xs text-[#5C5E62] hover:text-black">
                          {model}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <Link to="/search" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5C5E62] hover:text-black">
              <Search className="w-4 h-4" /> Search
            </Link>
            <hr className="border-gray-100 my-3" />
{isAuthenticated && user ? (
                <DropdownMenu className="relative w-full">
                  <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5C5E62] hover:text-black w-full text-left">
                    <Avatar name={user.full_name || 'User'} src={user.avatar_url} size="sm" className="w-4 h-4" />
                  </DropdownMenuTrigger>
<DropdownMenuContent className="w-56 mt-2 z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                      <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/profile')}>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/orders')}>
                        <List className="w-4 h-4 mr-2" />
                        Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/messages')}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/cart')}>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Bag
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => navigate('/wishlist')}>
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="px-3 py-2 text-red-500 hover:bg-red-50 flex items-center">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5C5E62] hover:text-black">
                  <CircleUser className="w-4 h-4" />
                </Link>
              )}
          </div>
        </div>
      )}
    </header>
  )
}
