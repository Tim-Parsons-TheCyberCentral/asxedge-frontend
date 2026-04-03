/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        edge: {
          black:    '#080c0f',
          dark:     '#0d1317',
          panel:    '#111820',
          border:   '#1a2530',
          green:    '#00ff88',
          'green-dim': '#00cc6a',
          red:      '#ff3b5c',
          amber:    '#ffb800',
          blue:     '#0099ff',
          muted:    '#4a6070',
          text:     '#c8d8e0',
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        mono:    ['var(--font-mono)'],
        body:    ['var(--font-body)'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'slide-in':    'slideIn 0.4s ease both',
        'fade-up':     'fadeUp 0.5s ease both',
        'ticker':      'ticker 30s linear infinite',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
