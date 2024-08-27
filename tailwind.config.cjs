/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter ", ...defaultTheme.fontFamily.sans],
        atipla: ["Atipla ND ", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        blackOnWhite:
          "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3) !important",
        whiteOnWhite:
          "0 8px 12px -3px rgba(0, 0, 0, 0.05), 0 3px 5px -4px rgba(0, 0, 0, 0.05) !important",
      },
      colors: {
        white: colors.white,
        gray: colors.gray,
        black: "#172148",
        accent: {
        '50': '#ebf7ff',
        '100': '#d2edff',
        '200': '#afdfff',
        '300': '#78ceff',
        '400': '#38b1ff',
        '500': '#0b8aff',
        '600': '#0065ff',
        '700': '#004cff',
        '800': '#003dd4',
        '900': '#02379e',
        '950': '#072364',
        '1000': '#1A2551',
        '1100': '#172148',
        '1200': '#141d40',
        '1300': '#0f1a3a',
        '1400': '#0a142e',
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
  ],
};
