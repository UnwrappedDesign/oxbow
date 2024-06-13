/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        white: colors.white,
        gray: colors.gray,
        black: "#121212",

         blue: {
            '50': 'hsl(225, 100%, 97%)',
            '100': 'hsl(225, 95%, 93%)',
            '200': 'hsl(223, 97%, 87%)',
            '300': 'hsl(221, 96%, 78%)',
            '400': 'hsl(223, 95%, 68%)',
            '500': 'hsl(227, 92%, 62%)',
            '600': 'hsl(230, 84%, 53%)',
            '700': 'hsl(234, 77%, 48%)',
            '800': 'hsl(235, 71%, 40%)',
            '900': 'hsl(234, 64%, 33%)',
            '950': 'hsl(236, 57%, 21%)',
            '1000': 'hsl( 239, 51%, 18%)',

          },
      },

    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require('tailwind-scrollbar-hide')
    // ...
  ],
};
