const { Colors } = require('react-native/Libraries/NewAppScreen');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000080",
        primaryBold: "#856526",
        primaryText: "#555",
      }
    },
  },
  plugins: [],
};
