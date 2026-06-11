import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { BRAND_PAGES } from '@/lib/constants'

export default function Layout() {
  const { pathname } = useLocation()
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  const slug = pathname.split('/')[1]
  const isBrandPage = BRAND_PAGES.some(p => p.slug === slug || (p.slug === 'nissan' && slug === 'gtr'))
  const isMessagesPage = pathname.startsWith('/messages')

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${isBrandPage ? 'pt-24 md:pt-[104px]' : 'pt-14 md:pt-16'} bg-white`}>
        <Outlet />
      </main>
      {!isMessagesPage && <Footer />}
    </div>
  )
}
