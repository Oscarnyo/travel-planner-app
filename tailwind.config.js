/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backBlue:'#eaedf4',
        secondary:'#367AFF',
        borderGrey:'#D9D9D9'
      },
    },
  },
  plugins: [],
}

