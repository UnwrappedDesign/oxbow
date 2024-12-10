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
    950: "#072364",
},
// Uses Tailwind CSS Gray + a 25% tint
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
green: {
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
red: {
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
yellow: {
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
```

If you are using Tailwind v4 use this:
```sass
/* Accent  */
--color-accent-25: #f5fbff;
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
--color-base-25: #fafafa;
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
/* green */
--color-green-25: #edfcf5;
--color-green-50: #cafae4;
--color-green-100: #97f5d2;
--color-green-200: #5fe2be;
--color-green-300: #37c6ab;
--color-green-400: #06a192;
--color-green-500: #048a89;
--color-green-600: #036a73;
--color-green-700: #014d5d;
--color-green-800: #01384d;
--color-green-900: #012c3c;
--color-green-950: #011e2e;
/* red */
--color-red-25: #fff0ef;
--color-red-50: #fed9d5;
--color-red-100: #feacad;
--color-red-200: #fd838f;
--color-red-300: #fb6382;
--color-red-400: #f9316d;
--color-red-500: #d6236a;
--color-red-600: #b31865;
--color-red-700: #900f5c;
--color-red-800: #770955;
--color-red-900: #5f0743;
--color-red-950: #4a032f;
/* yellow */
--color-yellow-25: #fffaf0;
--color-yellow-50: #fff3d5;
--color-yellow-100: #ffe4ab;
--color-yellow-200: #ffd181;
--color-yellow-300: #ffbe62;
--color-yellow-400: #ffa02e;
--color-yellow-500: #db7e21;
--color-yellow-600: #b75f17;
--color-yellow-700: #93450e;
--color-yellow-800: #7a3108;
--color-yellow-900: #602706;
--color-yellow-950: #4d1c03;
```

## Shadows

We are using a custom default shadow:

for Tailwind v3 use this:
```js
boxShadow: {
   DEFAULT: "0 0 0 1px #0e3f7e0a, 0 1px 1px -.5px #2a33450a, 0 3px 3px -1.5px #2a33460a, 0 6px 6px -3px #2a33460a, 0 12px 12px -6px #0e3f7e0a, 0 24px 24px -12px #0e3f7e0a;",
},
```
For Tailwind v4 use this:
```sass
--shadow:0 0 0 1px #0e3f7e0a, 0 1px 1px -.5px #2a33450a, 0 3px 3px -1.5px #2a33460a, 0 6px 6px -3px #2a33460a, 0 12px 12px -6px #0e3f7e0a, 0 24px 24px -12px #0e3f7e0a;
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
