'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface V2User {
  id: string
  name: string
  email: string
  role: string // 'customer' | 'admin' | 'member'
  packageType: string | null
  packageStatus: string
}

export function useV2Auth() {
  const [user, setUser] = useState<V2User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // 1. Check v2 session (cookie-based JWT)
      const res = await fetch('/api/v2/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setUser(data.data)
          setLoading(false)
          return
        }
      }

      // 2. No v2 session - check if admin or member is logged in
      const adminId = localStorage.getItem('adminId')
      const adminName = localStorage.getItem('adminName')
      const adminEmail = localStorage.getItem('adminEmail')
      const memberId = localStorage.getItem('memberId')
      const memberName = localStorage.getItem('memberName')
      const memberEmail = localStorage.getItem('memberEmail')

      if (adminId && adminName && adminEmail) {
        // Auto-link admin to EndUser
        const linkRes = await fetch('/api/v2/auth/auto-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'admin', adminId, name: adminName, email: adminEmail }),
        })
        if (linkRes.ok) {
          const linkData = await linkRes.json()
          setUser(linkData.data)
          setLoading(false)
          return
        }
      }

      if (memberId && memberName && memberEmail) {
        // Auto-link member to EndUser
        const linkRes = await fetch('/api/v2/auth/auto-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'member', memberId, name: memberName, email: memberEmail }),
        })
        if (linkRes.ok) {
          const linkData = await linkRes.json()
          setUser(linkData.data)
          setLoading(false)
          return
        }
      }

      // 3. No auth at all - redirect to login
      router.push('/login?role=customer')
    } catch (error) {
      console.error('V2 auth error:', error)
      router.push('/login?role=customer')
    }
  }

  return { user, loading, setUser }
}
