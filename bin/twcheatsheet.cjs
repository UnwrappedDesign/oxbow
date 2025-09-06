const fs = require('fs');
const path = require('path');

// Tailwind v4-ish defaults (curated subset for a compact cheat sheet)
const colors = [
  'slate','gray','zinc','neutral','stone',
  'red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose',
];
const shades = ['50','100','200','300','400','500','600','700','800','900','950'];
const directions = ['t','tr','r','br','b','bl','l','tl'];
const spacing = [
  '0','0.5','1','1.5','2','2.5','3','3.5','4','5','6','8','10','12','16','20','24','32','40','48','56','64'
];
const textSizes = ['xs','sm','base','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl'];
const fontWeights = ['thin','extralight','light','normal','medium','semibold','bold','extrabold','black'];
const radii = ['none','sm','','md','lg','xl','2xl','3xl','full'];
const shadows = ['sm','','md','lg','xl','2xl','inner','none'];
const opacity = ['0','5','10','20','30','40','50','60','70','80','90','95','100'];

function nonEmpty(arr) { return arr.filter(Boolean); }

function build() {
  const categories = [];

  // Colors
  categories.push({
    name: 'Colors',
    groups: [
      { name: 'Background Color', classes: colors.flatMap(c => shades.map(s => `bg-${c}-${s}`)) },
      { name: 'Text Color', classes: colors.flatMap(c => shades.map(s => `text-${c}-${s}`)) },
      { name: 'Border Color', classes: colors.flatMap(c => shades.map(s => `border-${c}-${s}`)) },
    ],
  });

  // Gradients
  categories.push({
    name: 'Gradients',
    groups: [
      { name: 'Direction', classes: directions.map(d => `bg-gradient-to-${d}`) },
      { name: 'From', classes: colors.flatMap(c => shades.map(s => `from-${c}-${s}`)) },
      { name: 'Via', classes: colors.flatMap(c => shades.map(s => `via-${c}-${s}`)) },
      { name: 'To', classes: colors.flatMap(c => shades.map(s => `to-${c}-${s}`)) },
    ],
  });

  // Spacing
  const spacingTargets = ['m','mx','my','mt','mr','mb','ml','p','px','py','pt','pr','pb','pl','gap'];
  categories.push({
    name: 'Spacing',
    groups: spacingTargets.map(target => ({ name: target, classes: spacing.map(s => `${target}-${s}`) })),
  });

  // Typography
  categories.push({
    name: 'Typography',
    groups: [
      { name: 'Text Size', classes: textSizes.map(s => `text-${s}`) },
      { name: 'Font Weight', classes: fontWeights.map(w => `font-${w}`) },
      { name: 'Font Family', classes: ['font-sans','font-serif','font-mono'] },
      { name: 'Text Align', classes: ['text-left','text-center','text-right','text-justify'] },
    ],
  });

  // Layout
  categories.push({
    name: 'Layout',
    groups: [
      { name: 'Display', classes: ['block','inline-block','inline','flex','inline-flex','grid','inline-grid','hidden'] },
      { name: 'Flexbox', classes: ['flex-row','flex-col','items-start','items-center','items-end','justify-start','justify-center','justify-between','justify-end','flex-wrap','flex-nowrap','grow','shrink'] },
      { name: 'Grid', classes: [
        ...Array.from({length:12},(_,i)=>`grid-cols-${i+1}`),
        ...Array.from({length:12},(_,i)=>`col-span-${i+1}`),
        ...Array.from({length:12},(_,i)=>`row-span-${i+1}`),
      ] },
      { name: 'Position', classes: ['static','relative','absolute','fixed','sticky','inset-0','top-0','right-0','bottom-0','left-0'] },
      { name: 'Z-Index', classes: ['-z-10','z-0','z-10','z-20','z-30','z-40','z-50','z-auto'] },
    ],
  });

  // Borders & Effects
  categories.push({
    name: 'Borders & Effects',
    groups: [
      { name: 'Border Width', classes: ['border','border-0','border-2','border-4','border-8'] },
      { name: 'Radius', classes: nonEmpty(radii.map(r => r ? `rounded-${r}` : 'rounded')) },
      { name: 'Shadow', classes: nonEmpty(shadows.map(s => s ? `shadow-${s}` : 'shadow')) },
      { name: 'Opacity', classes: opacity.map(o => `opacity-${o}`) },
      { name: 'Overflow', classes: ['overflow-hidden','overflow-auto','overflow-scroll','overflow-x-auto','overflow-y-auto'] },
    ],
  });

  // Interactivity
  categories.push({
    name: 'Interactivity',
    groups: [
      { name: 'Cursor', classes: ['cursor-auto','cursor-default','cursor-pointer','cursor-wait','cursor-text','cursor-move','cursor-help','cursor-not-allowed'] },
      { name: 'User Select', classes: ['select-none','select-text','select-all','select-auto'] },
      { name: 'Pointer Events', classes: ['pointer-events-none','pointer-events-auto'] },
      { name: 'Appearance', classes: ['appearance-none','appearance-auto'] },
    ],
  });

  // Transforms
  const scaleVals = ['0','50','75','90','95','100','105','110','125','150'];
  const rotateVals = ['0','1','2','3','6','12','45','90','180'];
  const translateVals = ['0','0.5','1','1.5','2','2.5','3','3.5','4','5','6','8','10','12','16','20','24','32','40','48','56','64','full'];
  const skewVals = ['0','1','2','3','6','12'];
  categories.push({
    name: 'Transforms',
    groups: [
      { name: 'Transform', classes: ['transform','transform-gpu','transform-none','preserve-3d','backface-hidden'] },
      { name: 'Scale', classes: [
        ...scaleVals.map(v => `scale-${v}`),
        ...scaleVals.map(v => `scale-x-${v}`),
        ...scaleVals.map(v => `scale-y-${v}`),
      ] },
      { name: 'Rotate', classes: rotateVals.map(v => `rotate-${v}`) },
      { name: 'Translate', classes: [
        ...translateVals.map(v => `translate-x-${v}`),
        ...translateVals.map(v => `translate-y-${v}`),
      ] },
      { name: 'Skew', classes: [
        ...skewVals.map(v => `skew-x-${v}`),
        ...skewVals.map(v => `skew-y-${v}`),
      ] },
      { name: 'Origin', classes: ['origin-center','origin-top','origin-top-right','origin-right','origin-bottom-right','origin-bottom','origin-bottom-left','origin-left','origin-top-left'] },
    ],
  });

  // Filters
  const filterVals = ['none',''];
  categories.push({
    name: 'Filters',
    groups: [
      { name: 'Filter', classes: ['filter','filter-none'] },
      { name: 'Blur', classes: ['blur-none','blur-sm','blur','blur-md','blur-lg','blur-xl','blur-2xl','blur-3xl'] },
      { name: 'Brightness', classes: ['brightness-0','brightness-50','brightness-75','brightness-90','brightness-95','brightness-100','brightness-105','brightness-110','brightness-125','brightness-150','brightness-200'] },
      { name: 'Contrast', classes: ['contrast-0','contrast-50','contrast-75','contrast-100','contrast-125','contrast-150','contrast-200'] },
      { name: 'Grayscale', classes: ['grayscale','grayscale-0'] },
      { name: 'Invert', classes: ['invert','invert-0'] },
      { name: 'Sepia', classes: ['sepia','sepia-0'] },
      { name: 'Saturate', classes: ['saturate-0','saturate-50','saturate-100','saturate-150','saturate-200'] },
      { name: 'Hue Rotate', classes: ['hue-rotate-0','hue-rotate-15','hue-rotate-30','hue-rotate-60','hue-rotate-90','hue-rotate-180'] },
      { name: 'Drop Shadow', classes: ['drop-shadow','drop-shadow-sm','drop-shadow-md','drop-shadow-lg','drop-shadow-xl','drop-shadow-2xl','drop-shadow-none'] },
      { name: 'Backdrop Filter', classes: ['backdrop-filter','backdrop-filter-none'] },
    ],
  });

  // Transitions & Animation
  categories.push({
    name: 'Transitions & Animation',
    groups: [
      { name: 'Transition Property', classes: ['transition-none','transition','transition-colors','transition-opacity','transition-shadow','transition-transform'] },
      { name: 'Duration', classes: ['duration-75','duration-100','duration-150','duration-200','duration-300','duration-500','duration-700','duration-1000'] },
      { name: 'Timing Function', classes: ['ease-linear','ease-in','ease-out','ease-in-out'] },
      { name: 'Delay', classes: ['delay-75','delay-100','delay-150','delay-200','delay-300','delay-500','delay-700','delay-1000'] },
      { name: 'Animation', classes: ['animate-none','animate-spin','animate-ping','animate-pulse','animate-bounce'] },
    ],
  });

  // Tables
  categories.push({
    name: 'Tables',
    groups: [
      { name: 'Border Collapse', classes: ['border-collapse','border-separate'] },
      { name: 'Table Layout', classes: ['table-auto','table-fixed'] },
      { name: 'Caption Side', classes: ['caption-top','caption-bottom'] },
    ],
  });

  // SVG
  categories.push({
    name: 'SVG',
    groups: [
      { name: 'Fill', classes: ['fill-inherit','fill-current','fill-transparent','fill-black','fill-white'] },
      { name: 'Stroke', classes: ['stroke-inherit','stroke-current','stroke-transparent','stroke-black','stroke-white'] },
      { name: 'Stroke Width', classes: ['stroke-0','stroke-1','stroke-2'] },
    ],
  });

  // Accessibility
  categories.push({
    name: 'Accessibility',
    groups: [
      { name: 'Screen Readers', classes: ['sr-only','not-sr-only'] },
      { name: 'Forced Color Adjust', classes: ['forced-color-adjust-auto','forced-color-adjust-none'] },
    ],
  });

  const out = {
    meta: {
      version: 'v4',
      generatedAt: new Date().toISOString(),
    },
    categories,
  };

  const outPath = path.join(__dirname, '../src/data/tw-cheatsheet.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Generated ${outPath}`);
}

build();
