/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#AC3B61',       // Hồng đậm
        secondary: '#123C69',     // Xanh Navy
        accent: '#EDC7B7',        // Cam đất/Peach
        'neutral-bg': '#EEE2DC',  // Nền kem
        'neutral-text': '#BAB2B5' // Xám tím
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}