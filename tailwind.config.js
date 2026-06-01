/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a2332",
        secondary: "#636e72",
        accent: "#00b894",
        warning: "#fdcb6e",
        dark: "#2d3436",
      }
    },
  },
  plugins: [],
}
