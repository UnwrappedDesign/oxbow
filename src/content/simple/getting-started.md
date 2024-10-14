---
page: Getting started
---

# Getting started

Using oxbow is easy and very straight forward.
All you need is, only if you want to have some colors and typography defined on your CSS and/or config file ( `tailwind.config.cjs`).

We are using different naming for colors, for example:

- Accent
- Base
- Success
- Error
- Warning

The values go from 25 to 950

A part of the color naming we are also using our own custom tints and shades, you can use any color you want.
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
```

## Shadows

We are using a custom default shadow:
```js
boxShadow: {
   DEFAULT: "0 0 0 1px #0e3f7e0a, 0 1px 1px -.5px #2a33450a, 0 3px 3px -1.5px #2a33460a, 0 6px 6px -3px #2a33460a, 0 12px 12px -6px #0e3f7e0a, 0 24px 24px -12px #0e3f7e0a;",
},
```

## Typography

For typography we are using Inter, but we have customized and added stylistic sets.

You can grab the CDN from Rasmus website.

```html
<!-- HTML in your document's head -->
<Text  rel="preconnect" href="https://rsms.me/" />
<Text  rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

We are using this stylistic sets and you can learn more about it [here](https://rsms.me/inter/)

```css
/* CSS */
:root {
  font-family: Inter, sans-serif;
  font-feature-settings:

    /*-------- NUMBERS --------*/
    /* Tabular numbers */
    "tnum" 1,
    /* Slashed zero */ "zero" 1,
    /* Alternate one */ "cv01" 1,
    /* Flat-top three */ "cv09" 1,
    /* Open four */ "cv02" 1,
    /* Open six */ "cv03" 1,
    /* Open nine */ "cv04" 1,
    /*-------- LETTERS --------*/ /* Square punctuation */ "ss08" 1,
    /* Discretionary ligatures */ "dlig" 1,
    /* Simplified u */ "cv06" 1,
    /* Capital G with spur */ "cv10" 1,
    /* Compact t */ "cv13" 1;
}

@supports (font-variation-settings: normal) {
  /* Use variable font if supported */
  :root {
    font-family: InterVariable, sans-serif;
  }
}
```

## Icons

We have choosen to use Tabler Icons, because it has almost 7k icons fo free and open source.
You can grab them here: [Tabler Icons](https://tabler-icons.io/)

Any questions just ask us by [email](mailto:michael@andreuzza.com) or on [Twitter](https://twitter.com/mike_andreuzza).
