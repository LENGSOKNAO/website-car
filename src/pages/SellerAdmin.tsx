import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, BarChart3, Settings } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

export default function SellerAdmin() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seller Admin</h1>
        <p className="text-gray-600">Welcome to your seller dashboard, {user?.name}.</p>
      </div>
    </div>
  )
}
