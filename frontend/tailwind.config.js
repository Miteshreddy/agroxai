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
        // Semantic background colors
        'brand-bg': 'var(--bg-primary)',
        'brand-bg-secondary': 'var(--bg-secondary)',
        'brand-bg-tertiary': 'var(--bg-tertiary)',

        // Surface colors (cards, panels)
        'brand-surface': 'var(--surface-solid)',
        'brand-surface-inset': 'var(--surface-inset)',
        'brand-surface-elevated': 'var(--surface-elevated)',

        // Text colors
        'brand-text-primary': 'var(--text-primary)',
        'brand-text-secondary': 'var(--text-secondary)',
        'brand-text-tertiary': 'var(--text-tertiary)',
        'brand-text-muted': 'var(--text-muted)',

        // Accent colors
        'brand-primary': 'var(--accent-primary)',
        'brand-dark': 'var(--accent-hover)',
        'brand-soft': 'var(--accent-soft)',
        'brand-green': 'var(--accent-primary)',
        'brand-gold': 'var(--accent-cyan)',

        // Borders
        'brand-border': 'var(--border-color)',
        'brand-border-strong': 'var(--border-strong)',

        // Legacy aliases (backward compatibility)
        'brand-cream': 'var(--surface-solid)',
        'brand-olive': 'var(--text-secondary)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'premium': 'var(--shadow-premium)',
        'premium-hover': 'var(--shadow-premium-hover)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.25)',
      },
      fontFamily: {
        'sans': ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
