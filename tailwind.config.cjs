/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        blackOnWhite:
          "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
        whiteOnWhite:
          "0 8px 12px -3px rgba(0, 0, 0, 0.05), 0 3px 5px -4px rgba(0, 0, 0, 0.05) ",
        xs: "0 0 0 0.5px #0e3f7e0a, 0 0.5px 0.5px -0.25px #2a33450a, 0 1.5px 1.5px -0.75px #2a33460a, 0 3px 3px -1.5px #2a33460a, 0 6px 6px -3px #0e3f7e0a, 0 12px 12px -6px #0e3f7e0a;",
        sm: "0 0 0 1px #0e3f7e0a, 0 1px 1px -0.5px #2a33450a, 0 3px 3px -1.5px #2a33460a, 0 6px 6px -3px #2a33460a, 0 12px 12px -6px #0e3f7e0a, 0 24px 24px -12px #0e3f7e0a;",
        md: "0 0 0 2px #0e3f7e0a, 0 2px 2px -1px #2a33450a, 0 6px 6px -3px #2a33460a, 0 12px 12px -6px #2a33460a, 0 24px 24px -12px #0e3f7e0a, 0 48px 48px -24px #0e3f7e0a;",
        lg: "0 0 0 4px #0e3f7e0a, 0 4px 4px -2px #2a33450a, 0 12px 12px -6px #2a33460a, 0 24px 24px -12px #2a33460a, 0 48px 48px -24px #0e3f7e0a, 0 96px 96px -48px #0e3f7e0a;",
        xl: "0 0 0 6px #0e3f7e0a, 0 6px 6px -3px #2a33450a, 0 18px 18px -9px #2a33460a, 0 36px 36px -18px #2a33460a, 0 72px 72px -36px #0e3f7e0a, 0 144px 144px -72px #0e3f7e0a;",
        "2xl":
          "0 0 0 8px #0e3f7e0a, 0 8px 8px -4px #2a33450a, 0 24px 24px -12px #2a33460a, 0 48px 48px -24px #2a33460a, 0 96px 96px -48px #0e3f7e0a, 0 192px 192px -96px #0e3f7e0a;",
        "3xl":
          "0 0 0 10px #0e3f7e0a, 0 10px 10px -5px #2a33450a, 0 30px 30px -15px #2a33460a, 0 60px 60px -30px #2a33460a, 0 120px 120px -60px #0e3f7e0a, 0 240px 240px -120px #0e3f7e0a;",
        // Add your default shadow
        DEFAULT:
          "0 0 0 1px #0e3f7e0a, 0 1px 1px -.5px #2a33450a, 0 3px 3px -1.5px #2a33460a, 0 6px 6px -3px #2a33460a, 0 12px 12px -6px #0e3f7e0a, 0 24px 24px -12px #0e3f7e0a;",
      },
      colors: {
        white: colors.white,
        gray: colors.gray,
        black: "#0f1a3a",
        accent: {
          25: "#f5fbff",
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
          950: "#0f1a3a",
          // Only for oxbow inside use
         1000: "#1A2551",
          1100: "#172148",
          1200: "#141d40",
          1300: "#0f1a3a",
          1400: "#0a142e",
        },
        base: {
          25: "#fafafa",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        success: {
          25: "#edfcf5",
          50: "#cafae4",
          100: "#97f5d2",
          200: "#5fe2be",
          300: "#37c6ab",
          400: "#06a192",
          500: "#048a89",
          600: "#036a73",
          700: "#014d5d",
          800: "#01384d",
          900: "#012c3c",
          950: "#011e2e",
        },
        error: {
          25: "#fff0ef",
          50: "#fed9d5",
          100: "#feacad",
          200: "#fd838f",
          300: "#fb6382",
          400: "#f9316d",
          500: "#d6236a",
          600: "#b31865",
          700: "#900f5c",
          800: "#770955",
          900: "#5f0743",
          950: "#4a032f",
        },
        warning: {
          25: "#fffaf0",
          50: "#fff3d5",
          100: "#ffe4ab",
          200: "#ffd181",
          300: "#ffbe62",
          400: "#ffa02e",
          500: "#db7e21",
          600: "#b75f17",
          700: "#93450e",
          800: "#7a3108",
          900: "#602706",
          950: "#4d1c03",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-motion"),
  ],
};
