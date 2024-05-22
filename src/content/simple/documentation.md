---
page: Documentation
---
# Documentation

Getting started

All components are designed for compatibility with the latest version of Tailwind CSS. To access the most current release of Tailwind CSS, please update it via npm.

Except for the customized blue color, all components adhere to the standard Tailwind CSS configuration. Certain components also require the use of first-party plugins, such as:

- @tailwindcss/forms
- @tailwindcss/typography
- @tailwindcss/aspect-ratio

### Typography  — Inter

To use the Inter font, please refer to the website of its creator:
- [CDN](https://rsms.me/inter)
- [download it directly](https://rsms.me/inter/)

Windstatic uses a Inter but is customed to fit the perosonality with this options.
```css
/* CSS */
:root {
  font-family: Inter, sans-serif;
  font-feature-settings:
  "liga" 1,
  "calt" 1, /* Contextual Alternates */
  "dlig" 1, /* Discretionary Ligatures */
  "ss07" 1, /* fSquare punctuation */
  "ss08" 1, /* Square quotes */
  "zero" 1, /* Slashed zero */
  "tnum" 1, /* Tabular numbers */
  "cv03" 1, /* Open six */
  "cv04" 1, /* Open nine */
  "cv01" 1, /* Alternate one */
  "cv09", /* Flat-top three */
  "cv02" 1; /* Open 4 */
}
@supports (font-variation-settings: normal) {
  /* Use variable font if supported */
  :root {
    font-family: InterVariable, sans-serif;
  }
}
```

### Alpine.js

Alpine.js is used for dynamic elements like navigation menus and accordions. It is available for use via CDN or installation at the official Alpine.js website.