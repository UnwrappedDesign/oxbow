/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter ", ...defaultTheme.fontFamily.sans],
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
        black: "#121212",
        accent: {
        '50': '#f1f5fd',
          '100': '#e0eaf9',
          '200': '#c8daf5',
          '300': '#a3c3ed',
          '400': '#77a2e3',
          '500': '#5783da',
          '600': '#4267cd',
          '700': '#3955bc',
          '800': '#344799',
          '900': '#2e3e7a',
          '950': '#20284b',
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
