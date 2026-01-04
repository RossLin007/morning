/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Morning app theme colors
        primary: {
          DEFAULT: '#B45309', // amber-700
          light: '#D97706', // amber-600
          dark: '#92400E', // amber-800
        },
        background: {
          light: '#F2F2EF',
          dark: '#050505',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['System'],
        serif: ['Georgia'],
      },
    },
  },
  plugins: [],
}
