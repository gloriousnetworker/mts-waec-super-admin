// login/verify-2fa/page.jsx
'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSuperAdminAuth } from '../../../context/AuthContext'
import toast from 'react-hot-toast'
import Image from 'next/image'

function Verify2FAContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyTwoFactor } = useSuperAdminAuth()

  const userId = searchParams.get('userId')
  const tempToken = searchParams.get('tkn')

  useEffect(() => {
    if (!userId || !tempToken || userId === 'undefined' || tempToken === 'undefined') {
      toast.error('Invalid verification link')
      router.push('/login')
      return
    }
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [userId, tempToken, router])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    // Auto-submit when all 6 digits filled
    if (value && index === 5) {
      const complete = [...newOtp.slice(0, 5), value.slice(-1)]
      if (complete.every(d => d !== '')) {
        submitOtp(complete.join(''))
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Paste support — paste a 6-digit string into all boxes at once
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || ''
    }
    setOtp(newOtp)
    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
    if (pasted.length === 6) {
      submitOtp(pasted)
    }
  }

  const submitOtp = async (token) => {
    if (token.length !== 6 || loading) return
    if (!userId || !tempToken) {
      toast.error('Missing verification data')
      router.push('/login')
      return
    }

    setLoading(true)
    const verifyToast = toast.loading('Verifying code...')

    try {
      const result = await verifyTwoFactor(userId, token, tempToken)
      if (result.success) {
        toast.success('Verification successful!', { id: verifyToast })
        router.replace('/dashboard')
      } else {
        toast.error(result.message || 'Invalid code — please try again', { id: verifyToast })
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        setLoading(false)
      }
    } catch {
      toast.error('Verification failed', { id: verifyToast })
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitOtp(otp.join(''))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1F2A49 0%, #1a2340 50%, #141C33 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ghost logo background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ position: 'relative', width: 520, height: 520, opacity: 0.05 }}>
          <Image src="/logo.png" alt="" fill className="object-contain" priority />
        </div>
      </div>

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 700px 500px at 50% 50%, rgba(58,79,122,0.30) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '28px' }}
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
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '8px',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '-0.02em',
          }}>
            Two-Factor Authentication
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.5,
          }}>
            Open your authenticator app and enter the current 6-digit code.
          </p>
        </motion.div>

        {/* OTP Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        >
          {/* OTP Inputs */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '28px',
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                maxLength={1}
                autoComplete="one-time-code"
                style={{
                  width: '52px',
                  height: '60px',
                  background: digit ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  border: digit
                    ? '1.5px solid rgba(255,255,255,0.4)'
                    : '1.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#fff',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.15s',
                  fontFamily: '"JetBrains Mono", monospace',
                  caretColor: 'transparent',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid rgba(255,255,255,0.6)'
                  e.target.style.background = 'rgba(255,255,255,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.border = digit
                    ? '1.5px solid rgba(255,255,255,0.4)'
                    : '1.5px solid rgba(255,255,255,0.12)'
                }}
              />
            ))}
          </div>

          {/* Hint */}
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}>
            Codes refresh every 30 seconds in Google Authenticator or Authy.
          </p>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading || otp.some(d => d === '')}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '12px',
              background: loading || otp.some(d => d === '')
                ? 'rgba(255,255,255,0.08)'
                : '#FFFFFF',
              border: 'none',
              color: loading || otp.some(d => d === '')
                ? 'rgba(255,255,255,0.3)'
                : '#1F2A49',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: loading || otp.some(d => d === '') ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              minHeight: '48px',
            }}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </motion.button>
        </motion.form>

        {/* Back to login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: '20px' }}
        >
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
            }}
          >
            ← Back to login
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1F2A49 0%, #141C33 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="spinner" />
      </div>
    }>
      <Verify2FAContent />
    </Suspense>
  )
}
