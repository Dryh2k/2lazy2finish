/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ad2bee",
        "bg-light": "#f7f6f8",
        "bg-dark": "#0a050d",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
  },
  plugins: [],
}
