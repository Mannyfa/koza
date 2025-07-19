/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all your React components in the src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sets a clean, modern font for the dashboard
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}