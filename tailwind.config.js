/** @type {import('tailwindcss').Config} */
module.exports = {
  // Add dark mode strategy
  darkMode: 'class',

  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This path includes all your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Sets a nice default font
      },
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Add the custom gold color
        gold: {
          400: '#FCD34D',
          500: '#FBBF24',
          600: '#F59E0B',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'), // A plugin for aspect ratio utilities
    require('@tailwindcss/forms'), // For styling forms
    require('@tailwindcss/typography'), // For styling the blog post content
  ],
}
