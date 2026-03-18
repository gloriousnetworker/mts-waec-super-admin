'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #1F2A49 0%, #1a2340 50%, #141C33 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Subtle radial glow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 600px 500px at 50% 50%, rgba(58,79,122,0.30) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.05, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 1.2, times: [0, 0.6, 1], ease: 'easeOut' }}
            style={{ marginBottom: '40px', position: 'relative', zIndex: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 60px rgba(58,79,122,0.4), 0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              <Image
                src="/logo.png"
                alt="Einstein's CBT App"
                width={80}
                height={80}
                priority
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              />
            </motion.div>
            {/* Pulsing ring */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '34px',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
          </motion.div>

          {/* Text + progress */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '0 32px',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            <h1 style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '4px',
              fontFamily: '"Playfair Display", serif',
            }}>
              Einstein's CBT
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '28px',
            }}>
              Super Admin Portal
            </p>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '100px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
                style={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '100px',
                }}
              />
            </div>

            {/* Loading dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>

            <p style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.2)',
              fontFamily: 'Inter, sans-serif',
              marginTop: '20px',
            }}>
              Mega Tech Solutions · © {new Date().getFullYear()}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
