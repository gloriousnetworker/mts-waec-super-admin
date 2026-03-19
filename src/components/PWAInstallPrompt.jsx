'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

const STORAGE_KEY = 'pwa_prompt_dismissed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or installed
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a brief delay so the page feels settled
      setTimeout(() => setVisible(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem(STORAGE_KEY, '1');
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="fixed bottom-6 right-4 sm:right-6 z-[200] w-[calc(100vw-32px)] sm:w-80"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
          >
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-accent" />

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-brand-primary-lt flex items-center justify-center">
                  <Smartphone size={20} className="text-brand-primary" strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-content-primary leading-tight">
                    Install Super Admin App
                  </p>
                  <p className="text-xs text-content-secondary mt-0.5 leading-snug">
                    Add to your home screen for faster access and offline support.
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 text-content-muted hover:text-content-secondary transition-colors rounded-md"
                  aria-label="Dismiss install prompt"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              {/* Install button */}
              <button
                onClick={handleInstall}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-semibold rounded-xl py-2.5 hover:bg-brand-primary-dk transition-colors min-h-[44px]"
              >
                <Download size={16} strokeWidth={2.5} />
                Install App
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
