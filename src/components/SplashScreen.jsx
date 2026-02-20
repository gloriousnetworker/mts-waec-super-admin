'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setVisible(false), 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(progressInterval);
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
            background: 'linear-gradient(135deg, #0a0f2e 0%, #1a237e 30%, #1565c0 60%, #0d47a1 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.03, 0.07, 0.03],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.7,
                }}
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(100,181,246,0.4) 0%, transparent 70%)',
                  width: `${200 + i * 80}px`,
                  height: `${200 + i * 80}px`,
                  left: `${10 + i * 15}%`,
                  top: `${5 + i * 12}%`,
                }}
              />
            ))}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(21,101,192,0.3) 0%, transparent 70%)',
            }} />
          </div>

          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{
              scale: [0.3, 1.1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.6, 1],
              ease: 'easeInOut',
            }}
            style={{ marginBottom: '48px', position: 'relative', zIndex: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 60px rgba(100,181,246,0.3), 0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              <Image
                src="/logo.png"
                alt="Mega Tech Solutions Logo"
                width={80}
                height={80}
                priority
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '32px',
                border: '1px solid rgba(100,181,246,0.3)',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '0 32px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              style={{ textAlign: 'center', marginBottom: '32px' }}
            >
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '6px',
                fontFamily: '"Playfair Display", serif',
              }}>
                MEGA TECH
              </h1>
              <p style={{
                fontSize: '13px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"Playfair Display", serif',
              }}>
                Super Admin Portal
              </p>
            </motion.div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{
                width: '100%',
                height: '2px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '100px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #64b5f6, #90caf9)',
                    borderRadius: '100px',
                    boxShadow: '0 0 10px rgba(100,181,246,0.8)',
                  }}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: '"Playfair Display", serif',
              }}>
                Powered by Mega Tech Solutions · © {new Date().getFullYear()}
              </p>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '28px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#64b5f6',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}