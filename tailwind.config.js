/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      white: "#ffffff",
      light_gray: "#c4c7c7",
      light_pink: "#f8ede0",
      white_pink: "#dbb7b2",
      dark_pink: "#c88880",
      blue: "#4D3C77",
      dark_blue: "#3F1D38",
      black: "#040402"
    },
    extend: {},
  },
  plugins: [
  ],
}

