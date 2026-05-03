/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F5F5F0',
        'brand-dark': '#1A1A1A',
        'brand-green': '#2D4B37',
        'brand-gold': '#C8A951',
        'brand-olive': '#6B705C',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
