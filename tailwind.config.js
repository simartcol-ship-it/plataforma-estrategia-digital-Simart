/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        simart: {
          orange: '#ff6d2a',
          'orange-light': '#ff7600',
          blue: '#132b3c',
          black: '#1b1b1b',
          gray: '#a5a5a5'
        }
      }
    },
  },
  plugins: [],
}
