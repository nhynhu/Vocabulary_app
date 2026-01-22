/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#AC3B61',
        secondary: '#123C69',
        accent: '#EDC7B7',
        'neutral-bg': '#EEE2DC',
        'neutral-text': '#BAB2B5',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        'navbar-height': '80px',
      },
      zIndex: {
        'navbar': '50',
        'dropdown': '40',
        'modal': '9999',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, rgba(18, 60, 105, 0.6), rgba(0, 0, 0, 0.8))',
      },
    },
  },
  plugins: [],
}