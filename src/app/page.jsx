'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SplashScreen from '../components/SplashScreen'
import { useSuperAdminAuth } from '../context/AuthContext'

export default function SuperAdminHomePage() {
  const router = useRouter()
  const { isAuthenticated, authChecked } = useSuperAdminAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authChecked) {
        if (isAuthenticated) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, isAuthenticated, authChecked])

  return <SplashScreen />
}