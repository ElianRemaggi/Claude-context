/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#faf8f5',
          100: '#f0ebe3',
          200: '#e2d5c5',
          300: '#cdb89e',
          400: '#b89a7a',
          500: '#a88363',
          600: '#9a7257',
          700: '#805c49',
          800: '#694c3f',
          900: '#564035',
          950: '#2e211b',
        },
        ink: {
          50: '#f4f6f7',
          100: '#e3e7ea',
          200: '#c9d1d7',
          300: '#a4b0ba',
          400: '#778795',
          500: '#5c6c7a',
          600: '#4f5b68',
          700: '#444e57',
          800: '#3c434b',
          900: '#353b41',
          950: '#1e2227',
        },
        amber: {
          400: '#f6b93b',
          500: '#e8a317',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
