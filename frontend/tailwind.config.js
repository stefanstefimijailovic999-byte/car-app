/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#060a13',
          light: '#0f1a2e',
        },
        primary: {
          DEFAULT: '#00e5ff',
        },
        secondary: {
          DEFAULT: '#0080ff',
        },
        text: {
          DEFAULT: '#e8edf5',
          muted: '#9fb0c9',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}