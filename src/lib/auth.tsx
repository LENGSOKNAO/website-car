import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { api } from './api'

// Helper function to decode JWT token and extract user data
const decodeJwtToken = (token: string): any => {
  try {
    // Split the token and decode the payload
    const payload = token.split('.')[1]
    if (!payload) return null
    
    // Add padding if needed
    const paddedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(paddedPayload)
    return JSON.parse(decodedPayload)
  } catch {
    return null
  }
}

export interface AuthUser {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  location: string | null
  is_dealer: boolean
  dealer_name: string | null
  role: string
  roles: { id: number | string; name: string; guard_name: string; created_at?: string; updated_at?: string; pivot?: any }[]
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { full_name: string; email: string; password: string; password_confirmation: string }) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  updateProfile: (data: { full_name?: string; phone?: string | null; location?: string | null; avatar_url?: string | null }) => Promise<void>
  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

    // Helper to check if an object has basic user identifying fields
    const hasUserIdentifiers = (obj: any): boolean => {
      return obj &&
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.full_name === 'string'
    }
    
    // Helper to create a AuthUser object from partial data
    const createUserFromData = (data: any): AuthUser | null => {
      if (!data || typeof data !== 'object') return null
      
      // Extract what we can, provide defaults for missing required fields
      const user: AuthUser = {
        id: data.id || '',
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone !== undefined ? data.phone : null,
        avatar_url: data.avatar_url !== undefined ? data.avatar_url : null,
        location: data.location !== undefined ? data.location : null,
        is_dealer: data.is_dealer !== undefined ? data.is_dealer : false,
        dealer_name: data.dealer_name !== undefined ? data.dealer_name : null,
        role: data.role || '',
        roles: Array.isArray(data.roles) ? data.roles : []
      }
      
      // Only return if we have the essential identifiers
      return user.id && user.full_name ? user : null
    }

    const refreshUser = useCallback(async () => {
      try {
        const res = await api.me()
        let userData: AuthUser | null = null
        if (res && res.data) {
          if (hasUserIdentifiers(res.data)) {
            const user = createUserFromData(res.data)
            if (user) userData = user
          } else if (res.data.data && hasUserIdentifiers(res.data.data)) {
            const user = createUserFromData(res.data.data)
            if (user) userData = user
          } else if (Array.isArray(res.data.data) && res.data.data.length > 0 && hasUserIdentifiers(res.data.data[0])) {
            const user = createUserFromData(res.data.data[0])
            if (user) userData = user
          } else if (Array.isArray(res.data.data) && res.data.data.length > 0 &&
                   res.data.data[0].other_user && hasUserIdentifiers(res.data.data[0].other_user)) {
            const user = createUserFromData(res.data.data[0].other_user)
            if (user) userData = user
          } else if (res.data.data && typeof res.data.data === 'object' && !Array.isArray(res.data.data) && hasUserIdentifiers(res.data.data)) {
            const user = createUserFromData(res.data.data)
            if (user) userData = user
          }
        }
        if (userData) {
          setUser(userData)
        } else {
          const token = localStorage.getItem('token')
          if (token) {
            const jwtUser = decodeJwtToken(token)
            if (jwtUser) {
              const user = createUserFromData(jwtUser)
              if (user) setUser(user)
            }
          }
        }
      } catch (error) {
        if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
          localStorage.removeItem('token')
          setUser(null)
        } else {
          const token = localStorage.getItem('token')
          if (token) {
            const jwtUser = decodeJwtToken(token)
            if (jwtUser) {
              const user = createUserFromData(jwtUser)
              if (user) setUser(user)
            }
          }
        }
      }
    }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      refreshUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password)
      if (res === null || res === undefined) {
        throw new Error('Login response is null or undefined from server')
      }
      if (!res.data) {
        throw new Error('Login response.data is null or undefined from server')
      }
      const { token, user: userData } = res.data
      if (!token) throw new Error('No token received from login')
      if (!userData) throw new Error('No user received from login')
      localStorage.setItem('token', token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: { full_name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const res = await api.register(data)
      if (res === null || res === undefined) {
        throw new Error('Register response is null or undefined from server')
      }
      if (!res.data) {
        throw new Error('Register response.data is null or undefined from server')
      }
      const { token, user: userData } = res.data
      if (!token) throw new Error('No token received from registration')
      if (!userData) throw new Error('No user received from registration')
      localStorage.setItem('token', token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (data: { full_name?: string; phone?: string | null; location?: string | null; avatar_url?: string | null }) => {
    const res = await api.updateProfile(data)
    if (res?.data) {
      let userData: AuthUser | null = null
      if (hasUserIdentifiers(res.data)) {
        userData = createUserFromData(res.data)
      } else if (res.data.user && hasUserIdentifiers(res.data.user)) {
        userData = createUserFromData(res.data.user)
      } else if (res.data.data && hasUserIdentifiers(res.data.data)) {
        userData = createUserFromData(res.data.data)
      }
      if (userData) setUser(userData)
    }
  }

  const changePassword = async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    await api.changePassword(data)
  }

  const logout = async () => {
    try { await api.logout() } catch { /* ignore */ }
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user, refreshUser, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}