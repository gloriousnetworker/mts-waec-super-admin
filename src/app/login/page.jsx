// login/page.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSuperAdminAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Eye, EyeOff, Shield } from 'lucide-react'

export default function SuperAdminLoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const router = useRouter()
  const { login, isAuthenticated, authChecked } = useSuperAdminAuth()
  const videoRef = useRef(null)
  const currentYear = new Date().getFullYear()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && authChecked && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, authChecked, router, mounted])

  useEffect(() => {
    if (loading && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier || !password) {
      toast.error('Please enter your credentials')
      return
    }
    setLoading(true)
    const loginToast = toast.loading('Signing in...')

    try {
      const result = await login(identifier, password)

      if (result.requiresTwoFactor) {
        toast.dismiss(loginToast)
        if (result.userId && result.tempToken) {
          router.push(`/login/verify-2fa?userId=${result.userId}&tkn=${result.tempToken}`)
        } else {
          toast.error('Invalid 2FA response from server')
          setLoading(false)
        }
      } else if (result.success) {
        toast.success('Welcome back!', { id: loginToast })
        setTimeout(() => router.replace('/dashboard'), 1200)
      } else {
        toast.error(result.message || 'Invalid credentials', { id: loginToast })
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed. Please try again.', { id: loginToast })
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast.error('Please contact your system administrator to reset your password')
  }

  const inputStyle = (field) => ({
    position: 'relative',
    borderRadius: '12px',
    border: `1.5px solid ${focusedField === field ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)'}`,
    background: focusedField === field ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
    transition: 'all 0.15s',
  })

  return (
    <>
      {/* Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #1F2A49 0%, #1a2340 50%, #141C33 100%)',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {/* Ghost logo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <div style={{ position: 'relative', width: 560, height: 560, opacity: 0.04 }}>
            <Image src="/logo.png" alt="" fill className="object-contain" priority />
          </div>
        </div>
        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 700px 500px at 50% 50%, rgba(58,79,122,0.30) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#141C33' }}
          >
            <video
              ref={videoRef}
              src="/loader.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card — outer div is the scroll container so short screens don't clip the top */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          padding: '16px',
          boxSizing: 'border-box',
        }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '32px 28px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo + heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: '24px' }}
          >
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: '20px',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                filter: 'blur(24px)',
                transform: 'scale(2)',
                background: 'rgba(58,79,122,0.35)',
              }} />
              <Image
                src="/logo.png"
                alt="Einstein's CBT App"
                width={72}
                height={72}
                priority
                style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }}
              />
            </div>

            <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '6px',
              fontFamily: '"Playfair Display", serif',
            }}>
              Einstein's CBT
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '12px',
            }}>
              Super Admin Portal
            </p>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.02em',
            }}>
              <Shield size={11} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.5)' }} />
              Restricted Access
            </span>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Email Address
              </label>
              <div style={inputStyle('email')}>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="superadmin@example.com"
                  disabled={loading}
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    caretColor: 'rgba(255,255,255,0.7)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Password
              </label>
              <div style={inputStyle('password')}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 16px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    caretColor: 'rgba(255,255,255,0.7)',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff size={18} strokeWidth={2} />
                    : <Eye size={18} strokeWidth={2} />
                  }
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '24px', marginTop: '-12px' }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'Inter, sans-serif',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                background: loading ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                border: 'none',
                color: loading ? 'rgba(255,255,255,0.3)' : '#1F2A49',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                minHeight: '50px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              marginTop: '28px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Mega Tech Solutions</span>
              {' · '}Einstein's CBT App
            </p>
            <p style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.15)',
              fontFamily: 'Inter, sans-serif',
              marginTop: '4px',
            }}>
              © {currentYear} All rights reserved
            </p>
          </motion.div>
        </motion.div>
        </div>
      </div>

      <style jsx global>{`
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </>
  )
}
