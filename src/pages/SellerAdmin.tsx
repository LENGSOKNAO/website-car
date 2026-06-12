import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  BarChart3,
  Settings,
  Car,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function SellerAdmin() {
  const { user } = useAuth()
  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    Promise.all([
      api.listings({ seller_id: user.id, per_page: '100' }).catch(() => ({ data: { data: [] } })),
      api.orders().catch(() => ({ data: { data: [] } })),
    ])
      .then(([listingsRes, ordersRes]) => {
        const listingsData = listingsRes?.data?.data ?? listingsRes?.data ?? []
        const ordersData = ordersRes?.data?.data ?? ordersRes?.data ?? []
        setListings(Array.isArray(listingsData) ? listingsData : [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const statusCounts = listings.reduce(
    (acc: Record<string, number>, l: any) => {
      const s = l.status || 'unknown'
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value,
  }))

  const activeListings = listings.filter((l: any) => l.status === 'in_stock' || l.status === 'active').length
  const soldListings = listings.filter((l: any) => l.status === 'sold').length
  const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'confirmed').length
  const completedOrders = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-10 w-10 bg-gray-100 rounded-lg mb-4" />
                <div className="h-4 bg-gray-100 rounded w-20 mb-2" />
                <div className="h-6 bg-gray-100 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user?.full_name || user?.name || 'Seller'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Listings</p>
            <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Active Listings</p>
            <p className="text-2xl font-bold text-gray-900">{activeListings}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Sold</p>
            <p className="text-2xl font-bold text-gray-900">{soldListings}</p>
          </motion.div>
        </div>

        {(listings.length === 0 && orders.length === 0) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start by listing your first car. Once you have listings and orders, your
              sales analytics and charts will appear here.
            </p>
            <a
              href="/sell"
              className="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Car className="w-4 h-4 mr-2" />
              List Your First Car
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Listings by Status
              </h2>
              {statusData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusData.map((_: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  No listing data available
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Overview
              </h2>
              {orders.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Pending', count: pendingOrders },
                        { name: 'Completed', count: completedOrders },
                        { name: 'Total', count: orders.length },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p>No orders yet</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/sell"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Car className="w-4 h-4" />
              Add Listing
            </a>
            <a
              href="/messages"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Messages
            </a>
            <a
              href="/orders"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </a>
            <a
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
