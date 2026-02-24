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
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)
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
    }
  }, [userId, tempToken, router])

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = otp.join('')
    if (token.length !== 6) {
      toast.error('Please enter complete 6-digit code')
      return
    }

    if (!userId || !tempToken) {
      toast.error('Missing verification data')
      router.push('/login')
      return
    }

    setLoading(true)
    const verifyToast = toast.loading('Verifying code...')
    
    try {
      const result = await verifyTwoFactor(userId, token, tempToken)
      if (result.success && result.tokens) {
        toast.success('Verification successful!', { id: verifyToast })
        setTimeout(() => { router.push('/dashboard') }, 1500)
      } else {
        toast.error(result.message || 'Invalid verification code', { id: verifyToast })
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        setLoading(false)
      }
    } catch (error) {
      toast.error('Verification failed', { id: verifyToast })
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setTimeLeft(30)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    toast.success('New code sent to your authenticator app')
  }

  const formatTime = (seconds) => {
    return `${seconds}s`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f2e 0%, #1a237e 30%, #1565c0 60%, #0d47a1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          padding: '48px 40px',
          textAlign: 'center',
        }}
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
          margin: '0 auto 24px',
        }}>
          <Image src="/logo.png" alt="Logo" width={44} height={44} />
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px',
          fontFamily: '"Playfair Display", serif',
        }}>
          Two-Factor Authentication
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '32px',
          fontFamily: '"Playfair Display", serif',
        }}>
          Enter the 6-digit code from your authenticator app
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '32px',
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                maxLength={1}
                style={{
                  width: '56px',
                  height: '64px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#fff',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <span style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"Playfair Display", serif',
            }}>
              Code expires in: <span style={{ color: '#64b5f6' }}>{formatTime(timeLeft)}</span>
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              style={{
                background: 'none',
                border: 'none',
                color: canResend ? '#90caf9' : 'rgba(255,255,255,0.3)',
                fontSize: '13px',
                cursor: canResend ? 'pointer' : 'default',
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Resend Code
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
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: '"Playfair Display", serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(21,101,192,0.5)',
            }}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f2e 0%, #1a237e 30%, #1565c0 60%, #0d47a1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#fff' }}>Loading...</div>
      </div>
    }>
      <Verify2FAContent />
    </Suspense>
  )
}