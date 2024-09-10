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

        gray: {
          50: "#FCFCFE",
          75: "#F9FAFE",
          100: "#F4F5FB",
          200: "#E3E7EE",
          300: "#D0D7E1",
          400: "#A2AEC3",
          500: "#78859B",
          600: "#5F6C81",
          700: "#4A5363",
          800: "#343B46",
          900: "#1E2229",
          950: "#13161A",
        },
        green: {
          50: "#f0faf0",
          100: "#e2f6e3",
          200: "#c5edc6",
          300: "#97de9a",
          400: "#62c667",
          500: "#3fab44",
          600: "#2d8c31",
          700: "#266f29",
          800: "#235826",
          900: "#1e4921",
          950: "#0e2f11",
        },
        red: {
          50: "#fdf3f3",
          100: "#fde3e3",
          200: "#fbcdcd",
          300: "#f8a9a9",
          400: "#f17878",
          500: "#e64d4d",
          600: "#d32f2f",
          700: "#b12424",
          800: "#922222",
          900: "#6f1f1f",
          950: "#420d0d",
        },
        oxbow: {
          50: "#E0E1E6",
          100: "#D2D3DA",
          200: "#B6B8C3",
          300: "#9294A5",
          400: "#73768C",
          500: "#535565",
          600: "#353641",
          700: "#1E1F24",
          800: "#1C1C22",
          900: "#121316",
          950: "#0B0C0E",
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
