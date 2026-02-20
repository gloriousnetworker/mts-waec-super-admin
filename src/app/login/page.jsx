'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSuperAdminAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function SuperAdminLoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const router = useRouter()
  const { login, isAuthenticated } = useSuperAdminAuth()
  const videoRef = useRef(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (loading && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [loading])

  const handleLogin = async (email, pass) => {
    setLoading(true)
    const loginToast = toast.loading('Accessing Super Admin Portal...')
    try {
      const result = await login(email || identifier, pass || password)
      if (result.success) {
        toast.success('Welcome back, Super Admin!', { id: loginToast })
        setTimeout(() => { router.push('/dashboard') }, 1500)
      } else {
        toast.error(result.message || 'Invalid super admin credentials', { id: loginToast })
        setLoading(false)
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.', { id: loginToast })
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier || !password) {
      toast.error('Please enter your super admin credentials')
      return
    }
    handleLogin(identifier, password)
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0a0f2e 0%, #1a237e 30%, #1565c0 60%, #0d47a1 100%)',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.03, 0.08, 0.03],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.2,
            }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(100,181,246,0.5) 0%, transparent 70%)',
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${-5 + i * 20}%`,
              top: `${-10 + i * 18}%`,
              pointerEvents: 'none',
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 60%, rgba(21,101,192,0.25) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(10,15,46,0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '120px',
          height: '120px',
          opacity: 0.04,
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: '200px',
          height: '200px',
          opacity: 0.03,
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: '#0a0f2e',
            }}
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

      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        padding: '16px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '40px 36px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(100,181,246,0.05)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '36px' }}
          >
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 30px rgba(100,181,246,0.2)',
            }}>
              <Image
                src="/logo.png"
                alt="Mega Tech Solutions"
                width={44}
                height={44}
                style={{ objectFit: 'contain' }}
              />
            </div>

            <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '4px',
              fontFamily: '"Playfair Display", serif',
            }}>
              MEGA TECH
            </h1>
            <p style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '0.02em',
            }}>
              Solutions · Super Admin Portal
            </p>
            <div style={{
              marginTop: '12px',
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(100,181,246,0.1)',
              border: '1px solid rgba(100,181,246,0.2)',
            }}>
              <p style={{
                fontSize: '10px',
                color: 'rgba(144,202,249,0.8)',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '0.05em',
              }}>
                Kogi State Ministry of Education
              </p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{ marginBottom: '28px' }}
          >
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Email Address
              </label>
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                border: `1px solid ${focusedField === 'email' ? 'rgba(100,181,246,0.6)' : 'rgba(255,255,255,0.1)'}`,
                background: focusedField === 'email' ? 'rgba(100,181,246,0.05)' : 'rgba(255,255,255,0.04)',
                transition: 'all 0.2s ease',
                boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(100,181,246,0.1)' : 'none',
              }}>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@megatechsolutions.org"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#ffffff',
                    fontFamily: '"Playfair Display", serif',
                    caretColor: '#64b5f6',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Password
              </label>
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                border: `1px solid ${focusedField === 'password' ? 'rgba(100,181,246,0.6)' : 'rgba(255,255,255,0.1)'}`,
                background: focusedField === 'password' ? 'rgba(100,181,246,0.05)' : 'rgba(255,255,255,0.04)',
                transition: 'all 0.2s ease',
                boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(100,181,246,0.1)' : 'none',
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 16px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#ffffff',
                    fontFamily: '"Playfair Display", serif',
                    caretColor: '#64b5f6',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.4)',
                    padding: 0,
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  style={{ accentColor: '#64b5f6', width: '14px', height: '14px' }}
                />
                <span style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: '"Playfair Display", serif',
                }}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#90caf9',
                  fontFamily: '"Playfair Display", serif',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                background: loading
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(135deg, #1565c0 0%, #1e88e5 50%, #42a5f5 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: '"Playfair Display", serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(21,101,192,0.5)',
                transition: 'all 0.2s ease',
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? 'Accessing Portal...' : 'Sign In to Super Admin'}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{
                padding: '0 12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '0.05em',
              }}>
                Super Admin Access
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {[
                { icon: '🏢', label: 'School Mgmt' },
                { icon: '📊', label: 'Analytics' },
                { icon: '📑', label: 'Reports' },
                { icon: '🎫', label: 'Tickets' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px',
                    padding: '10px 6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: '"Playfair Display", serif',
                    lineHeight: 1.3,
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '16px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.25)',
                fontFamily: '"Playfair Display", serif',
                lineHeight: 1.6,
              }}>
                <span style={{ color: 'rgba(144,202,249,0.6)', fontWeight: 600 }}>Mega Tech Solutions</span>
                {' · '}In partnership with Kogi State Ministry of Education
              </p>
              <p style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.15)',
                fontFamily: '"Playfair Display", serif',
                marginTop: '4px',
              }}>
                © {currentYear} All rights reserved
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        input::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
    </>
  )
}