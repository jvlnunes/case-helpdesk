/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff4ff',
          100: '#dce7fd',
          200: '#bdd2fc',
          300: '#90b3f9',
          400: '#5c8df5',
          500: '#3669ef',
          600: '#1a56db',
          700: '#1347c0',
          800: '#163a9b',
          900: '#18347a',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
