'use client'

import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { SuperAdminAuthProvider } from '../context/AuthContext'
import { useEffect } from 'react'
import PWAInstallPrompt from '../components/PWAInstallPrompt'

const toastOptions = {
  style: {
    background: '#fff',
    color: '#1E1E1E',
    fontSize: '14px',
    padding: '14px 20px',
    borderRadius: '8px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E8E8E8',
    maxWidth: '400px',
    fontFamily: 'Inter, sans-serif',
  },
  success: {
    style: {
      background: '#EDF0F7',
      color: '#1F2A49',
      borderLeft: '4px solid #1F2A49',
      border: '1px solid #CBD5E1',
    },
    iconTheme: {
      primary: '#1F2A49',
      secondary: '#EDF0F7',
    },
  },
  error: {
    style: {
      background: '#FEF2F2',
      color: '#DC2626',
      borderLeft: '4px solid #DC2626',
      border: '1px solid #FEE2E2',
    },
    iconTheme: {
      primary: '#DC2626',
      secondary: '#FEF2F2',
    },
  },
  loading: {
    style: {
      background: '#F9FAFB',
      color: '#4B5563',
      borderLeft: '4px solid #9CA3AF',
      border: '1px solid #E5E7EB',
    },
  },
  duration: 3000,
}

export default function SuperAdminLayout({ children }) {
  useEffect(() => {
    const handleOffline = () => console.log('Super Admin App is offline')
    const handleOnline = () => console.log('Super Admin App is online')

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* viewport-fit=cover for notch/island devices
            interactive-widget=resizes-visual keeps Android keyboard from resizing layout
            maximum-scale=1, user-scalable=no prevents pinch-zoom (native app feel) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-visual" />
        <meta name="theme-color" content="#1F2A49" />
        <meta name="description" content="Einstein's CBT App — Super Admin Portal by Mega Tech Solutions" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mega Tech Super Admin" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Mega Tech Super Admin" />
        <meta name="msapplication-TileColor" content="#1F2A49" />
        <meta name="msapplication-tap-highlight" content="no" />
        <title>Mega Tech Solutions - Super Admin</title>
        <script src="/sw-register.js" defer></script>
      </head>
      {/* min-h-screen removed — body is locked via position:fixed in globals.css */}
      <body className="bg-surface-muted font-inter antialiased">
        <SuperAdminAuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={toastOptions}
            containerStyle={{
              top: 20,
            }}
          />
          {children}
          <PWAInstallPrompt />
        </SuperAdminAuthProvider>
      </body>
    </html>
  )
}