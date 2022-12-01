/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "an-1": "#303841",
        "an-2": "#262e35",
        "an-light": "#36404a",
        "an-text": "#eff2f7",
        "an-button": "#7269ef",
        "an-border": "#7269ef",
      },
      fontFamily: {
        PS: ["Public Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

//background-color: #7269ef;
//border-color: #7269ef;
