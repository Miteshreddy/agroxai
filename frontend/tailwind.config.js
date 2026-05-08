/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--accent-primary)',
        'brand-dark': 'var(--accent-hover)',
        'brand-soft': 'var(--accent-soft)',
        'brand-bg': 'var(--bg-primary)',
        'brand-text-primary': 'var(--text-primary)',
        'brand-text-secondary': 'var(--text-secondary)',
        'brand-cream': 'var(--card-bg)',
        'brand-green': 'var(--accent-primary)',
        'brand-gold': 'var(--accent-cyan)',
        'brand-olive': 'var(--bg-secondary)',
        'brand-border': 'var(--border-color)',
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
