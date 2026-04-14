/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables dark mode using the 'dark' class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
      },
    },
  },
  plugins: [],
};