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
--color-accent-50: #ebf7ff;
--color-accent-100: #d2edff;
--color-accent-200: #afdfff;
--color-accent-300: #78ceff;
--color-accent-400: #38b1ff;
--color-accent-500: #0b8aff;
--color-accent-600: #0065ff;
--color-accent-700: #004cff;
--color-accent-800: #003dd4;
--color-accent-900: #02379e;
--color-accent-950: #072364;
/* Base */
--color-base-50: #f9fafb;
--color-base-100: #f3f4f6;
--color-base-200: #e5e7eb;
--color-base-300: #d1d5db;
--color-base-400: #9ca3af;
--color-base-500: #6b7280;
--color-base-600: #4b5563;
--color-base-700: #374151;
--color-base-800: #1f2937;
--color-base-900: #111827;
--color-base-950: #030712;

```



## Typography

For typography we are using Geist. You can grab the CDN from  [Google Fonts](https://fonts.google.com/?query=geist)

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
