'use client'

import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { SuperAdminAuthProvider } from '../context/AuthContext'

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
    fontFamily: '"Playfair Display", serif',
  },
  success: {
    style: {
      background: '#F5F3FF',
      color: '#7C3AED',
      borderLeft: '4px solid #7C3AED',
      border: '1px solid #DDD6FE',
    },
    iconTheme: {
      primary: '#7C3AED',
      secondary: '#F5F3FF',
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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="description" content="Mega Tech Solutions - Super Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
        <title>Mega Tech Solutions - Super Admin</title>
      </head>
      <body className="bg-gray-50 min-h-screen font-playfair antialiased">
        <SuperAdminAuthProvider>
          <Toaster 
            position="top-center" 
            toastOptions={toastOptions}
            containerStyle={{
              top: 20,
            }}
          />
          {children}
        </SuperAdminAuthProvider>
      </body>
    </html>
  )
}