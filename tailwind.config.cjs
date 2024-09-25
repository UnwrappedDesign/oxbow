/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      display: "350",
    },
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
        // Polar
        /*  DEFAULT: `0 0px 15px rgba(0 0 0 / 0.04), 0 0px 2px rgba(0 0 0 / 0.06)`,
        lg: "0 0px 20px rgba(0 0 0 / 0.04), 0 0px 5px rgba(0 0 0 / 0.06)",
        xl: "0 0px 30px rgba(0 0 0 / 0.04), 0 0px 10px rgba(0 0 0 / 0.06)",
        hidden: "0 1px 8px rgb(0 0 0 / 0), 0 0.5px 2.5px rgb(0 0 0 / 0)",
        up: "-2px -2px 22px 0px rgba(61, 84, 171, 0.15)",
        "3xl": "0 0 50px rgba(0 0 0 / 0.02), 0 0 50px rgba(0 0 0 / 0.04)", */
      },
      colors: {
        white: colors.white,
        gray: colors.gray,
        black: "#172148",
        accent: {
          50: "#ebf7ff",
          100: "#d2edff",
          200: "#afdfff",
          300: "#78ceff",
          400: "#38b1ff",
          500: "#0b8aff",
          600: "#0065ff",
          700: "#004cff",
          800: "#003dd4",
          900: "#02379e",
          950: "#072364",
          1000: "#1A2551",
          1100: "#172148",
          1200: "#141d40",
          1300: "#0f1a3a",
          1400: "#0a142e",
        },
        blue: {
        '50': '#eef5ff',
        '100': '#d9e7ff',
        '200': '#bcd5ff',
        '300': '#8dbbff',
        '400': '#5896ff',
        '500': '#316eff',
        '600': '#1f50f6',
        '700': '#1337e2',
        '800': '#162eb7',
        '900': '#182d90',
        '950': '#141d57',
        },
          oxbow: {
          50: '#f7f7f7',
          100: '#dedede',
          200: '#c5c5c5',
          300: '#ababab',
          400: '#929292',
          500: '#797979',
          600: '#606060',
          700: '#464646',
          800: '#2d2d2d',
          900: '#141414',
          950: '#0a0a0a',
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
