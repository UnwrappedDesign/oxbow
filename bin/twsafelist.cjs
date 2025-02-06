const fs = require("fs");
const tailwindColors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "gray",
  "stone",
  "zinc",
  "neutral",
];

const tailwindColorShades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

const directionMap = {
  "to top": "t",
  "to top right": "tr",
  "to right": "r",
  "to bottom right": "br",
  "to bottom": "b",
  "to bottom left": "bl",
  "to left": "l",
  "to top left": "tl",
};

const columns = Array.from({ length: 12 }, (_, i) => i);
const rows = Array.from({ length: 12 }, (_, i) => i);
const gap = Array.from({ length: 16 }, (_, i) => i);

const others = [

];

const safelist = [
  ...others,
  ...tailwindColors.flatMap((color) =>
    tailwindColorShades.flatMap((shade) => [
      `bg-${color}-${shade}`,
      `from-${color}-${shade}`,
      `to-${color}-${shade}`,
    ]),
  ),
  ...Object.values(directionMap).map((direction) => `bg-gradient-to-${direction}`),
  ...columns.map((column) => `col-start-${column}`),
  ...rows.map((row) => `row-start-${row}`),
  ...columns.map((column) => `col-span-${column}`),
  ...rows.map((row) => `row-span-${row}`),
  ...gap.map((gap) => `gap-${gap}`),
];

fs.writeFileSync(`${__dirname}/../safelist.txt`, safelist.join("\n"));