/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7e3fa8",
        dark: {
          1: "#171717",
          2: "#222222", // sidebar, navbar
          3: "#333333", // input_bg
          4: "#424242", // bg, btn1_bg
          5: "#525252", // borders
          6: "#616161",
          7: "#727272",
          gray: "#b3b3b3",
          light: "#f5f5f5",
          hover: "#2e2e2e",
        },
        "neutral-750": "#333333",
        "neutral-700": "#424242",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("flowbite/plugin"),
    require("preline/plugin"),
  ],
};
