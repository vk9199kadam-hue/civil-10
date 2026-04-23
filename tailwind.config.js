/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        category: {
          residential: '#2563eb',
          commercial: '#7c3aed',
          land: '#d97706',
          industrial: '#475569',
          hospitality: '#e11d48',
        },
        status: {
          available: '#10b981',
          booked: '#f59e0b',
          sold: '#ef4444',
          blocked: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        'xs': '360px',
      },
    },
  },
  plugins: [],
}
