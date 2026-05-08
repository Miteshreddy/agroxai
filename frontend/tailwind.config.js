/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#10B981', // Neon emerald
        'brand-dark': '#065F46', // Deep emerald
        'brand-soft': 'rgba(16, 185, 129, 0.08)', // Glowing subtle emerald
        'brand-bg': '#0B1020', // Premium deep space navy
        'brand-text-primary': '#F8FAFC', // Slate-50 near-white
        'brand-text-secondary': '#94A3B8', // Slate-400 cool gray
        'brand-cream': 'rgba(255, 255, 255, 0.04)', // Glass dark backdrop
        'brand-green': '#10B981', // Emerald alias
        'brand-gold': '#22D3EE', // Brilliant cyber cyan
        'brand-olive': '#1E293B', // Deep dark slate-800
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
        'premium-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.5), 0 0 15px rgba(34, 211, 238, 0.15)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.25)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
