const { nextui } = require('@nextui-org/react');

module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Brand Colours ────────────────────────────────────────────────
      colors: {
        // Primary brand — Deep Navy Blue (from logo)
        'brand-primary':    '#1F2A49',
        'brand-primary-dk': '#141C33',
        'brand-primary-lt': '#EDF0F7',
        // Accent / secondary navy
        'brand-accent':     '#3A4F7A',
        // Gold — achievements, premium, avatar
        'brand-gold':       '#FFB300',
        'brand-gold-lt':    '#FFF8E1',
        // Darkest navy — sidebar header, exam mode headers
        'brand-navy':       '#0D1220',
        // Cyan — timer, progress accents
        'brand-cyan':       '#00B4D8',

        // ─── Surface Tokens ─────────────────────────────────────────────
        'surface-muted':    '#F5F7FB',
        'surface-subtle':   '#EDF0F7',

        // ─── Border Tokens ──────────────────────────────────────────────
        border:             '#E8ECEF',
        'border-strong':    '#CBD5E1',

        // ─── Content / Text Tokens ──────────────────────────────────────
        'content-primary':   '#0D1117',
        'content-secondary': '#525F7F',
        'content-muted':     '#8898AA',
        'content-inverse':   '#FFFFFF',

        // ─── Status Colours ─────────────────────────────────────────────
        success:         '#10B981',
        'success-light': '#D1FAE5',
        'success-dark':  '#059669',

        warning:         '#F59E0B',
        'warning-light': '#FEF3C7',
        'warning-dark':  '#D97706',

        danger:          '#EF4444',
        'danger-light':  '#FEE2E2',
        'danger-dark':   '#DC2626',

        info:            '#3B82F6',
        'info-light':    '#DBEAFE',
        'info-dark':     '#2563EB',

        // Keep legacy tokens for NextUI
        background: {
          DEFAULT: '#F5F7FB',
          dark:    '#0f172a',
        },
        foreground: {
          DEFAULT: '#0D1117',
          dark:    '#f8fafc',
        },
      },

      // ─── Font Families ────────────────────────────────────────────────
      fontFamily: {
        inter:    ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        mono:     ['"JetBrains Mono"', 'monospace'],
      },

      // ─── Font Size Scale ──────────────────────────────────────────────
      fontSize: {
        '2xs': ['12px', { lineHeight: '16px' }],
        xs:    ['13px', { lineHeight: '18px' }],
        sm:    ['14px', { lineHeight: '20px' }],
        base:  ['15px', { lineHeight: '22px' }],
        md:    ['16px', { lineHeight: '24px' }],
        lg:    ['17px', { lineHeight: '26px' }],
        xl:    ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '38px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
        '5xl': ['48px', { lineHeight: '56px' }],
      },

      // ─── Border Radius ────────────────────────────────────────────────
      borderRadius: {
        sm:    '6px',
        DEFAULT: '8px',
        md:    '10px',
        lg:    '12px',
        xl:    '16px',
        '2xl': '20px',
        '3xl': '24px',
        full:  '9999px',
      },

      // ─── Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
        brand:   '0 4px 14px rgba(31,42,73,0.30)',
        gold:    '0 4px 14px rgba(255,179,0,0.30)',
        inner:   'inset 0 2px 4px rgba(0,0,0,0.06)',
      },

      // ─── Responsive Breakpoints ───────────────────────────────────────
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // ─── Keyframes ────────────────────────────────────────────────────
      keyframes: {
        rotate: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        beep: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.2)' },
        },
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%':      { opacity: '1' },
        },
        dotBlink: {
          '0%, 100%': { opacity: '0' },
          '50%':      { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(31,42,73,0.20)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(31,42,73,0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        pingOnce: {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },

      // ─── Animation Utilities ──────────────────────────────────────────
      animation: {
        rotate:       'rotate 2s linear infinite',
        beep:         'beep 1.5s ease-in-out infinite',
        blink:        'blink 1.2s ease-in-out infinite',
        'dot-1':      'dotBlink 1s ease-in-out infinite',
        'dot-2':      'dotBlink 1s ease-in-out infinite 0.2s',
        'dot-3':      'dotBlink 1s ease-in-out infinite 0.4s',
        'fade-up':    'fadeUp 0.4s ease-out forwards',
        shimmer:      'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        gradient:     'gradient 8s ease infinite',
        'ping-once':  'pingOnce 0.6s ease-out forwards',
      },
    },
  },
  plugins: [nextui()],
  important: true,
};
