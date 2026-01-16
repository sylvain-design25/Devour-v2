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
        // Your existing color palette
        'devour-bg': '#F5F1E8',
        'devour-sidebar': '#E8DEC8',
        'devour-card': '#FFFFFF',
        'devour-text': '#2D2D2D',
        'devour-border': '#D4C5A9',
        'devour-accent': '#C9614D',
        'devour-hover': '#E8DEC8',
      },
    },
  },
  plugins: [],
}
