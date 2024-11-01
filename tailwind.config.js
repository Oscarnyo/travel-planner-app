/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backBlue:'#E5E8F8',
        secondary:'#367AFF',
        colorGray:'#d9dbe6',
        borderGrey:'#D9D9D9'
      },
    },
  },
  plugins: [],
}

