---
page: Getting started
---

# Getting started

Using oxbow is easy and very straight forward.
All you need is, only if you want to have some colors and typography defined on your CSS and/or config file ( `tailwind.config.cjs`). Depending on the Tailwind CSS version you are using.

We are using different naming for colors, the values go from 25 to 950, for example:

- Accent
- Base

A part of the color naming we are also using our own custom tints and shades, you can use any color you want.

The colors are only temporary, we are working on themeing where you can define any Tailwind CSS color.

If you are using Tailwind V3 use this:
This are the objects so you can copy paste it on your config file ( `tailwind.config.cjs`).

```js
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
},
// Uses Tailwind CSS Gray + a 25% tint
base: {
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
```

If you are using Tailwind v4 use this:

```sass
/* Accent  */
--color-blue-50: oklch(96.21% 0.017 259.42);
--color-blue-100: oklch(91.46% 0.038 259.29);
--color-blue-200: oklch(82.89% 0.078 258.12);
--color-blue-300: oklch(74.61% 0.12 258.41);
--color-blue-400: oklch(66.62% 0.161 258.21);
--color-blue-500: oklch(59.66% 0.199 258.86);
--color-blue-600: oklch(50.93% 0.199 260.1);
--color-blue-700: oklch(41.5% 0.157 259.78);
--color-blue-800: oklch(31.61% 0.114 259.3);
--color-blue-900: oklch(20.88% 0.065 257.42);
--color-blue-950: oklch(15.76% 0.04 253.21);
/* Base */
--color-gray-50: oklch(0.985 0 0);
--color-gray-100: oklch(0.97 0 0);
--color-gray-200: oklch(0.922 0 0);
--color-gray-300: oklch(0.87 0 0);
--color-gray-400: oklch(0.708 0 0);
--color-gray-500: oklch(0.556 0 0);
--color-gray-600: oklch(0.439 0 0);
--color-gray-700: oklch(0.371 0 0);
--color-gray-800: oklch(0.269 0 0);
--color-gray-900: oklch(0.205 0 0);
--color-gray-950: oklch(0.145 0 0);

```

## Typography

For typography we are using Geist. You can grab the CDN from [Google Fonts](https://fonts.google.com/?query=geist)

IF you are using Tailwind v3 use this:

```js
fontFamily: {
  sans: ["Geist", ...defaultTheme.fontFamily.sans],
  mono: ["Geist Mono", ...defaultTheme.fontFamily.mono],
},
```

If you are using Tailwind CSS V4

```sass
--font-mono: "Geist Mono", sans-serif;
--font-sans: "Geist", sans-serif;
```

## Icons

We have choosen to use Tabler Icons, because it has almost 7k icons fo free and open source.
You can grab them here: [Tabler Icons](https://tabler-icons.io/)

Any questions just ask us by [email](mailto:oxbowui@gmail.com) or on [Twitter](https://x.com/oxbowui).
