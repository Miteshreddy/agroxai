/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1F7A63',
        'brand-dark': '#145A4A',
        'brand-soft': '#E6F4EF',
        'brand-bg': '#F8FAFC',
        'brand-text-primary': '#0F172A',
        'brand-text-secondary': '#64748B',
        'brand-cream': '#F5F5F0', // Keeping for backward compatibility if needed, but will transition
        'brand-green': '#1F7A63', // Alias for primary
        'brand-gold': '#C8A951',
        'brand-olive': '#6B705C',
      },
      borderRadius: {
        '2xl': '12px',
        '3xl': '16px',
        '4xl': '24px',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 10px -1px rgba(15, 23, 42, 0.03)',
        'premium-hover': '0 20px 40px -12px rgba(15, 23, 42, 0.12)',
        'glow': '0 0 15px rgba(31, 122, 99, 0.2)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
