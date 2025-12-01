/** @type {import('tailwindcss').Config} */
module.exports = {
  // Add dark mode strategy
  darkMode: 'class',

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      // Add a custom gold color, as requested
      colors: {
        gold: {
          400: '#FCD34D', // A nice Tailwind-like gold
          500: '#FBBF24',
          600: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}
