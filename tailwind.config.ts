import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F4F3EF',
        surface: '#FFFFFF',
        surface2: '#EEEDE8',
        border: '#D9D7CF',
        text: '#1A1917',
        text2: '#6B6860',
        text3: '#9E9C95',
        accent: '#1B5E3F',
        'accent-light': '#E8F3ED',
        accent2: '#1E3A5F',
        'accent2-light': '#EFF6FF',
        warn: '#B45309',
        'warn-light': '#FEF3C7',
        red: '#991B1B',
        'red-light': '#FEE2E2',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config
