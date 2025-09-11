import React, { useState } from 'react';
import data from '@/data/tw-cheatsheet.json';

export default function TwCheatSheet() {
  // No search/filtering — show all categories/groups/classes
  const filtered = data.categories;

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  const [copied, setCopied] = useState<string>('');
  async function copy(cls: string) {
    try {
      await navigator.clipboard.writeText(cls);
      setCopied(cls);
      setTimeout(() => setCopied(''), 1000);
    } catch {}
  }

  function docsUrl(cat: string, group: string): string | null {
    const base = 'https://tailwindcss.com/docs/';
    const map: Record<string, string> = {
      // Colors
      'Background Color': 'background-color',
      'Text Color': 'text-color',
      'Border Color': 'border-color',
      // Gradients
      Direction: 'gradient-color-stops',
      From: 'gradient-color-stops',
      Via: 'gradient-color-stops',
      To: 'gradient-color-stops',
      // Typography
      'Text Size': 'font-size',
      'Font Weight': 'font-weight',
      'Font Family': 'font-family',
      'Text Align': 'text-align',
      'Font Style': 'font-style',
      'Text Transform': 'text-transform',
      'Text Decoration Line': 'text-decoration',
      'Text Decoration Style': 'text-decoration-style',
      'Text Decoration Thickness': 'text-decoration-thickness',
      'Text Underline Offset': 'text-underline-offset',
      'Text Wrap': 'text-wrap',
      'List Style Type': 'list-style-type',
      'List Style Position': 'list-style-position',
      'Font Smoothing': 'font-smoothing',
      'Font Variant Numeric': 'font-variant-numeric',
      'Letter Spacing': 'letter-spacing',
      'Line Clamp': 'line-clamp',
      'Line Height': 'line-height',
      'Text Overflow': 'text-overflow',
      'Text Indent': 'text-indent',
      'Vertical Align': 'vertical-align',
      'White Space': 'white-space',
      'Word Break': 'word-break',
      Hyphens: 'hyphens',
      Content: 'content',
      // Layout
      Display: 'display',
      Flexbox: 'flex',
      Grid: 'grid-template-columns',
      Position: 'position',
      'Z-Index': 'z-index',
      Visibility: 'visibility',
      Columns: 'columns',
      'Break Inside': 'break-inside',
      'Box Decoration Break': 'box-decoration-break',
      'Box Sizing': 'box-sizing',
      Float: 'float',
      Clear: 'clear',
      Isolation: 'isolation',
      'Object Fit': 'object-fit',
      'Object Position': 'object-position',
      'Overscroll Behavior': 'overscroll-behavior',
      'Background Attachment': 'background-attachment',
      'Background Clip': 'background-clip',
      'Background Image': 'background-image',
      'Background Origin': 'background-origin',
      'Background Position': 'background-position',
      'Background Repeat': 'background-repeat',
      'Background Size': 'background-size',
      'Background Blend Mode': 'background-blend-mode',
      // Borders & Effects
      'Border Style': 'border-style',
      'Border Width': 'border-width',
      Radius: 'border-radius',
      Shadow: 'box-shadow',
      'Outline Color': 'outline-color',
      'Outline Offset': 'outline-offset',
      'Outline Style': 'outline-style',
      'Outline Width': 'outline-width',
      Opacity: 'opacity',
      Overflow: 'overflow',
      // Spacing (dynamic)
      margin: 'margin',
      padding: 'padding',
      gap: 'gap',
      // Interactivity
      Cursor: 'cursor',
      'User Select': 'user-select',
      'Pointer Events': 'pointer-events',
      Appearance: 'appearance',
      Resize: 'resize',
      'Accent Color': 'accent-color',
      'Caret Color': 'caret-color',
      'Color Scheme': 'color-scheme',
      'Scroll Behavior': 'scroll-behavior',
      'Scroll Snap Align': 'scroll-snap-align',
      'Scroll Snap Type': 'scroll-snap-type',
      'Scroll Snap Stop': 'scroll-snap-stop',
      'Touch Action': 'touch-action',
      'Will Change': 'will-change',
      // Transforms
      Transform: 'transform',
      Scale: 'scale',
      Rotate: 'rotate',
      Translate: 'translate',
      Skew: 'skew',
      Origin: 'transform-origin',
      'Aspect Ratio': 'aspect-ratio',
      'Mix Blend Mode': 'mix-blend-mode',
      // Filters
      Filter: 'filter',
      Blur: 'blur',
      Brightness: 'brightness',
      Contrast: 'contrast',
      Grayscale: 'grayscale',
      Invert: 'invert',
      Sepia: 'sepia',
      Saturate: 'saturate',
      'Hue Rotate': 'hue-rotate',
      'Drop Shadow': 'drop-shadow',
      'Backdrop Filter': 'backdrop-filter',
      // Transitions & Animation
      'Transition Property': 'transition-property',
      Duration: 'transition-duration',
      'Timing Function': 'transition-timing-function',
      Delay: 'transition-delay',
      Animation: 'animation',
      // Tables
      'Border Collapse': 'border-collapse',
      'Table Layout': 'table-layout',
      'Caption Side': 'caption-side',
      // SVG
      Fill: 'fill',
      Stroke: 'stroke',
      'Stroke Width': 'stroke-width',
      // Accessibility
      'Screen Readers': 'screen-readers',
      'Forced Color Adjust': 'forced-color-adjust',
      // Sizing
      Width: 'width',
      'Min Width': 'min-width',
      'Max Width': 'max-width',
      Height: 'height',
      'Min Height': 'min-height',
      'Max Height': 'max-height',
    };

    if (cat === 'Spacing') {
      if (group.startsWith('m')) return base + map.margin;
      if (group.startsWith('p')) return base + map.padding;
      if (group === 'gap') return base + map.gap;
    }

    const key = group in map ? group : '';
    return key ? base + map[key] : null;
  }

  function groupDescription(cat: string, group: string): string | null {
    const map: Record<string, string> = {
      // Colors
      'Background Color': "Utilities for setting an element's background color.",
      'Text Color': "Utilities for setting an element's text color.",
      'Border Color': "Utilities for setting an element's border color.",
      // Gradients
      Direction: 'Set the direction of a background gradient.',
      From: 'Set the starting color stop of a gradient.',
      Via: 'Set the middle color stop of a gradient.',
      To: 'Set the ending color stop of a gradient.',
      // Typography
      'Text Size': 'Utilities for controlling the size of text.',
      'Font Weight': 'Utilities for controlling the weight (boldness) of text.',
      'Font Family': 'Utilities for controlling the font family.',
      'Text Align': 'Utilities for controlling text alignment.',
      'Font Style': 'Utilities for controlling the font style (italic/normal).',
      'Text Transform': 'Utilities for controlling the casing of text.',
      'Text Decoration Line': 'Utilities for controlling text decoration line(s).',
      'Text Decoration Style': 'Utilities for controlling the decoration style.',
      'Text Decoration Thickness': 'Utilities for controlling underline/line thickness.',
      'Text Underline Offset': 'Utilities for controlling underline offset from text.',
      'Text Wrap': 'Utilities for controlling text wrapping and balancing.',
      'List Style Type': 'Utilities for controlling list marker types.',
      'List Style Position': 'Utilities for controlling list marker position.',
      // Layout
      Display: 'Utilities for controlling the display box type of an element.',
      Flexbox: 'Utilities for building flexbox-based layouts.',
      Grid: 'Utilities for building CSS grid-based layouts.',
      Position: 'Utilities for controlling how an element is positioned.',
      'Z-Index': 'Utilities for controlling the stack order of an element.',
      Visibility: 'Utilities for controlling element visibility.',
      'Background Attachment': 'Utilities for controlling background attachment behavior.',
      // Borders & Effects
      'Border Width': 'Utilities for controlling the border width of an element.',
      Radius: 'Utilities for controlling the border radius of an element.',
      Shadow: 'Utilities for controlling the box shadow of an element.',
      'Outline Color': 'Utilities for controlling outline color.',
      Opacity: 'Utilities for controlling the opacity of an element.',
      Overflow: 'Utilities for controlling content overflow within an element.',
      // Interactivity
      Cursor: 'Utilities for controlling the cursor style.',
      'User Select': 'Utilities for controlling text selection behavior.',
      'Pointer Events': 'Utilities for controlling if an element responds to pointer events.',
      Appearance: 'Utilities for controlling native input styling.',
      Resize: 'Utilities for controlling element resizability.',
      // Transforms
      Transform: 'Enable or disable CSS transforms and related behaviors.',
      Scale: 'Utilities for scaling elements with transform.',
      Rotate: 'Utilities for rotating elements with transform.',
      Translate: 'Utilities for translating elements with transform.',
      Skew: 'Utilities for skewing elements with transform.',
      Origin: 'Utilities for setting the transform origin.',
      // Filters
      Filter: 'Enable or disable CSS filters.',
      Blur: 'Utilities for applying blur filters.',
      Brightness: 'Utilities for applying brightness filters.',
      Contrast: 'Utilities for applying contrast filters.',
      Grayscale: 'Utilities for applying grayscale filters.',
      Invert: 'Utilities for inverting colors.',
      Sepia: 'Utilities for applying sepia filters.',
      Saturate: 'Utilities for applying saturation filters.',
      'Hue Rotate': 'Utilities for rotating hues.',
      'Drop Shadow': 'Utilities for applying drop-shadow filters.',
      'Backdrop Filter': 'Utilities for applying backdrop filters.',
      // Transitions & Animation
      'Transition Property': 'Utilities for controlling which properties transition.',
      Duration: 'Utilities for controlling transition durations.',
      'Timing Function': 'Utilities for controlling easing timing functions.',
      Delay: 'Utilities for controlling transition delays.',
      Animation: 'Utilities for animating elements.',
      // Tables
      'Border Collapse': 'Utilities for controlling table border collapse behavior.',
      'Table Layout': 'Utilities for controlling table layout algorithm.',
      'Caption Side': 'Utilities for setting table caption side.',
      // SVG
      Fill: 'Utilities for setting SVG fill color.',
      Stroke: 'Utilities for setting SVG stroke color.',
      'Stroke Width': 'Utilities for setting SVG stroke width.',
      // Accessibility
      'Screen Readers': 'Utilities for improving accessibility for screen readers.',
      'Forced Color Adjust': 'Utilities for controlling forced-color-adjust behavior.',
    };
    if (cat === 'Spacing' && group === 'margin') return "Utilities for controlling an element's margin.";
    if (cat === 'Spacing' && group === 'padding') return "Utilities for controlling an element's padding.";
    if (cat === 'Spacing' && group === 'gap') return 'Utilities for controlling gaps between grid and flex items.';
    return map[group] || null;
  }

  function allKeys(categories: typeof filtered) {
    const keys: string[] = [];
    for (const cat of categories) {
      if (cat.name === 'Spacing') {
        const marginKeys = ['m','mx','my','mt','mr','mb','ml'];
        const paddingKeys = ['p','px','py','pt','pr','pb','pl'];
        const byName = Object.fromEntries(cat.groups.map(g => [g.name, g]));
        keys.push(`${cat.name}:margin`, `${cat.name}:padding`);
        for (const k of marginKeys) if (byName[k]) keys.push(`${cat.name}:${k}`);
        for (const k of paddingKeys) if (byName[k]) keys.push(`${cat.name}:${k}`);
        if (byName['gap']) keys.push(`${cat.name}:gap`);
      } else {
        for (const g of cat.groups) keys.push(`${cat.name}:${g.name}`);
      }
    }
    return keys;
  }

  function spacingGroupLabel(kind: 'padding'|'margin'|'gap', key: string) {
    if (kind === 'gap') return 'gap';
    const base = kind;
    const map: Record<string,string> = {
      p: base,
      px: `${base}-left/right`,
      py: `${base}-top/bottom`,
      pt: `${base}-top`,
      pr: `${base}-right`,
      pb: `${base}-bottom`,
      pl: `${base}-left`,
      m: base,
      mx: `${base}-left/right`,
      my: `${base}-top/bottom`,
      mt: `${base}-top`,
      mr: `${base}-right`,
      mb: `${base}-bottom`,
      ml: `${base}-left`,
    };
    return map[key] || base;
  }

  function parseSpacingValue(cls: string): number | null {
    const m = cls.match(/-(\d+(?:\.\d+)?)$/);
    return m ? parseFloat(m[1]) : null;
  }

  function formatRem(rem: number) {
    const s = rem.toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
    return `${s}rem`;
  }

  function pxFromRem(rem: number) {
    return Math.round(rem * 16);
  }

  // Cache dynamically computed CSS detail per class
  const [cssCache, setCssCache] = useState<Record<string, string>>({});

  function camelToKebab(s: string) {
    return s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  }

  function computeWithBaselineElement(
    cls: string,
    extras = '',
    tagName: 'div' | 'input' | 'textarea' = 'div',
    needsContainer = false
  ): CSSStyleDeclaration | null {
    try {
      const base = document.createElement(tagName);
      const el = document.createElement(tagName);
      if (tagName === 'input') {
        (base as HTMLInputElement).type = 'checkbox';
        (el as HTMLInputElement).type = 'checkbox';
      }
      el.className = `${extras ? extras + ' ' : ''}${cls}`;

      let container: HTMLDivElement | null = null;
      if (needsContainer) {
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '320px';
        container.style.height = '320px';
        base.style.width = '';
        base.style.height = '';
        el.style.width = '';
        el.style.height = '';
        container.appendChild(base);
        container.appendChild(el);
        document.body.appendChild(container);
      } else {
        base.style.position = el.style.position = 'absolute';
        base.style.left = el.style.left = '-9999px';
        base.style.top = el.style.top = '-9999px';
        document.body.appendChild(base);
        document.body.appendChild(el);
      }

      const baseComp = getComputedStyle(base);
      const comp = getComputedStyle(el);

      if (container) {
        document.body.removeChild(container);
      } else {
        document.body.removeChild(base);
        document.body.removeChild(el);
      }
      // Attach baseline as a hidden property for comparison
      // @ts-ignore
      comp.__baseline = baseComp;
      return comp;
    } catch {
      return null;
    }
  }

  function genericCssDetail(cls: string): string | null {
    if (cssCache[cls]) return cssCache[cls];
    // Choose element tag per property
    const tagForKey = (key: keyof CSSStyleDeclaration): 'div' | 'input' | 'textarea' => {
      if (key === 'accentColor' || key === 'caretColor' || key === 'appearance') return 'input';
      if (key === 'resize') return 'textarea';
      return 'div';
    };

    const comp = computeWithBaselineElement(cls);
    if (!comp) return null;
    // @ts-ignore
    const base: CSSStyleDeclaration = comp.__baseline;
    const props: Array<{ key: keyof CSSStyleDeclaration; name?: string; extras?: string; needsContainer?: boolean }> = [
      { key: 'backgroundColor', name: 'background-color' },
      { key: 'backgroundAttachment', name: 'background-attachment' },
      { key: 'backgroundBlendMode', name: 'background-blend-mode' },
      { key: 'color' },
      { key: 'borderTopColor', name: 'border-color', extras: 'border' },
      { key: 'borderTopStyle', name: 'border-style', extras: 'border' },
      { key: 'display' },
      { key: 'position' },
      { key: 'zIndex', name: 'z-index' },
      { key: 'opacity' },
      { key: 'textAlign', name: 'text-align' },
      { key: 'textDecorationLine', name: 'text-decoration-line' },
      { key: 'textDecorationColor', name: 'text-decoration-color' },
      { key: 'textDecorationStyle', name: 'text-decoration-style' },
      { key: 'textDecorationThickness', name: 'text-decoration-thickness' },
      { key: 'textUnderlineOffset', name: 'text-underline-offset' },
      { key: 'textIndent', name: 'text-indent' },
      { key: 'fontWeight', name: 'font-weight' },
      { key: 'fontStyle', name: 'font-style' },
      { key: 'fontSize', name: 'font-size' },
      { key: 'lineHeight', name: 'line-height' },
      { key: 'letterSpacing', name: 'letter-spacing' },
      { key: 'textTransform', name: 'text-transform' },
      { key: 'textWrap', name: 'text-wrap' },
      { key: 'textOverflow', name: 'text-overflow' },
      { key: 'verticalAlign', name: 'vertical-align' },
      { key: 'whiteSpace', name: 'white-space' },
      { key: 'overflowWrap', name: 'overflow-wrap' },
      { key: 'wordBreak', name: 'word-break' },
      { key: 'hyphens' },
      { key: 'appearance' },
      { key: 'accentColor', name: 'accent-color' },
      { key: 'caretColor', name: 'caret-color' },
      { key: 'colorScheme', name: 'color-scheme' },
      { key: 'mixBlendMode', name: 'mix-blend-mode' },
      { key: 'resize' },
      { key: 'scrollBehavior', name: 'scroll-behavior' },
      { key: 'scrollSnapAlign', name: 'scroll-snap-align' },
      { key: 'scrollSnapType', name: 'scroll-snap-type' },
      { key: 'scrollSnapStop', name: 'scroll-snap-stop' },
      { key: 'touchAction', name: 'touch-action' },
      { key: 'willChange', name: 'will-change' },
      { key: 'justifyContent', name: 'justify-content' },
      { key: 'alignItems', name: 'align-items' },
      { key: 'alignContent', name: 'align-content' },
      { key: 'placeContent', name: 'place-content' },
      { key: 'placeItems', name: 'place-items' },
      { key: 'placeSelf', name: 'place-self' },
      { key: 'alignSelf', name: 'align-self' },
      { key: 'order' },
      { key: 'flexGrow', name: 'flex-grow' },
      { key: 'flexShrink', name: 'flex-shrink' },
      { key: 'flexBasis', name: 'flex-basis' },
      { key: 'flexDirection', name: 'flex-direction' },
      { key: 'flexWrap', name: 'flex-wrap' },
      { key: 'gap' },
      { key: 'rowGap', name: 'row-gap' },
      { key: 'columnGap', name: 'column-gap' },
      { key: 'gridTemplateColumns', name: 'grid-template-columns' },
      { key: 'gridTemplateRows', name: 'grid-template-rows' },
      { key: 'gridColumn', name: 'grid-column' },
      { key: 'gridRow', name: 'grid-row' },
      { key: 'gridAutoFlow', name: 'grid-auto-flow' },
      { key: 'transform', extras: 'transform' },
      { key: 'transformStyle', name: 'transform-style', extras: 'preserve-3d' },
      { key: 'backfaceVisibility', name: 'backface-visibility', extras: 'backface-hidden' },
      { key: 'perspective' },
      { key: 'perspectiveOrigin', name: 'perspective-origin' },
      { key: 'filter', extras: 'filter' },
      { key: 'backdropFilter', name: 'backdrop-filter', extras: 'backdrop-filter' },
      { key: 'boxShadow', name: 'box-shadow' },
      // Border radius / width
      { key: 'borderTopLeftRadius', name: 'border-radius' },
      { key: 'borderTopWidth', name: 'border-width' },
      // Outline
      { key: 'outlineStyle', name: 'outline-style' },
      { key: 'outlineWidth', name: 'outline-width' },
      { key: 'outlineColor', name: 'outline-color' },
      { key: 'outlineOffset', name: 'outline-offset' },
      // Transition properties
      { key: 'transitionProperty', name: 'transition-property' },
      { key: 'transitionDuration', name: 'transition-duration' },
      { key: 'transitionTimingFunction', name: 'transition-timing-function' },
      { key: 'transitionDelay', name: 'transition-delay' },
      // Position offsets
      { key: 'top', extras: 'relative' },
      { key: 'right', extras: 'relative' },
      { key: 'bottom', extras: 'relative' },
      { key: 'left', extras: 'relative' },
      // Background image (gradients)
      { key: 'backgroundImage', name: 'background-image', extras: 'bg-gradient-to-r' },
      { key: 'backgroundClip', name: 'background-clip' },
      { key: 'backgroundOrigin', name: 'background-origin' },
      { key: 'backgroundPosition', name: 'background-position' },
      { key: 'backgroundRepeat', name: 'background-repeat' },
      { key: 'backgroundSize', name: 'background-size' },
      // Layout extras
      { key: 'aspectRatio', name: 'aspect-ratio' },
      { key: 'columnCount', name: 'column-count' },
      { key: 'columnWidth', name: 'column-width' },
      { key: 'boxSizing', name: 'box-sizing' },
      { key: 'cssFloat', name: 'float' },
      { key: 'clear' },
      { key: 'isolation' },
      { key: 'objectFit', name: 'object-fit' },
      { key: 'objectPosition', name: 'object-position' },
      { key: 'overscrollBehavior', name: 'overscroll-behavior' },
      { key: 'visibility' },
      // Sizing
      { key: 'width', needsContainer: true },
      { key: 'minWidth', name: 'min-width', needsContainer: true },
      { key: 'maxWidth', name: 'max-width', needsContainer: true },
      { key: 'height', needsContainer: true },
      { key: 'minHeight', name: 'min-height', needsContainer: true },
      { key: 'maxHeight', name: 'max-height', needsContainer: true },
    // Lists
      { key: 'listStyleType', name: 'list-style-type' },
      { key: 'listStylePosition', name: 'list-style-position' },
      { key: 'listStyleImage', name: 'list-style-image' },
      // Masks
      { key: 'maskClip', name: 'mask-clip' },
      { key: 'maskComposite', name: 'mask-composite' },
      { key: 'maskImage', name: 'mask-image' },
      { key: 'maskMode', name: 'mask-mode' },
      { key: 'maskOrigin', name: 'mask-origin' },
      { key: 'maskPosition', name: 'mask-position' },
      { key: 'maskRepeat', name: 'mask-repeat' },
      { key: 'maskSize', name: 'mask-size' },
      { key: 'maskType', name: 'mask-type' },
      // Tables
      { key: 'borderSpacing', name: 'border-spacing' },
    ];
    // Don't filter out values like 'none' or 'auto'. They are meaningful for
    // many utilities (e.g. list-none, resize-none) and should be shown.
    // We rely solely on baseline comparison to avoid showing default values.
    const neutral = new Set<string>([]);
    for (const p of props) {
      // If extras required re-compute for that prop
      const tag = tagForKey(p.key);
      const using = p.extras
        ? computeWithBaselineElement(cls, p.extras, tag, !!p.needsContainer)
        : (tag !== 'div' || p.needsContainer)
          ? computeWithBaselineElement(cls, '', tag, !!p.needsContainer)
          : comp;
      if (!using) continue;
      // @ts-ignore
      const baseComp: CSSStyleDeclaration = using.__baseline || base;
      const key = p.key as string;
      // @ts-ignore
      const v = using[key] as string;
      // @ts-ignore
      const b = baseComp[key] as string;
      if (v && v !== b) {
        const name = p.name || camelToKebab(key);
        const out = `${name}: ${v}`;
        setCssCache((s) => (s[cls] ? s : { ...s, [cls]: out }));
        return out;
      }
    }
    return null;
  }
  function cssDetail(cat: string, group: string, cls: string): string | null {
    // Colors — show property name
    if (group === 'Background Color') return 'background-color';
    if (group === 'Text Color') return 'color';
    if (group === 'Border Color') return 'border-color';

    // Display
    if (group === 'Display') {
      const map: Record<string, string> = {
        block: 'display: block',
        inline: 'display: inline',
        'inline-block': 'display: inline-block',
        flex: 'display: flex',
        'inline-flex': 'display: inline-flex',
        grid: 'display: grid',
        'inline-grid': 'display: inline-grid',
        table: 'display: table',
        'inline-table': 'display: inline-table',
        'flow-root': 'display: flow-root',
        hidden: 'display: none',
      };
      return map[cls] || 'display';
    }

    // Sizing: Width
    if (group === 'Width') {
      if (cls === 'w-px') return 'width: 1px';
      if (cls === 'w-full') return 'width: 100%';
      if (cls === 'w-1/2') return 'width: 50%';
      const v = parseSpacingValue(cls.replace(/^w-/, ''));
      if (v != null) {
        const rem = v * 0.25;
        return `width: ${formatRem(rem)}; (${pxFromRem(rem)}px)`;
      }
      return 'width';
    }

    // Sizing: Height
    if (group === 'Height') {
      if (cls === 'h-px') return 'height: 1px';
      if (cls === 'h-full') return 'height: 100%';
      if (cls === 'h-1/2') return 'height: 50%';
      const v = parseSpacingValue(cls.replace(/^h-/, ''));
      if (v != null) {
        const rem = v * 0.25;
        return `height: ${formatRem(rem)}; (${pxFromRem(rem)}px)`;
      }
      return 'height';
    }

    // Sizing: Min Width
    if (group === 'Min Width') {
      if (cls === 'min-w-0') return 'min-width: 0px';
      if (cls === 'min-w-full') return 'min-width: 100%';
      if (cls === 'min-w-min') return 'min-width: min-content';
      if (cls === 'min-w-max') return 'min-width: max-content';
      return 'min-width';
    }

    // Sizing: Max Width (common defaults)
    if (group === 'Max Width') {
      const map: Record<string, string> = {
        'max-w-0': '0px',
        'max-w-xs': '20rem',
        'max-w-sm': '24rem',
        'max-w-md': '28rem',
        'max-w-lg': '32rem',
        'max-w-xl': '36rem',
        'max-w-2xl': '42rem',
        'max-w-none': 'none',
        'max-w-full': '100%',
      };
      if (cls in map) {
        const val = map[cls];
        if (val.endsWith('rem')) {
          const rem = parseFloat(val);
          return `max-width: ${val}; (${pxFromRem(rem)}px)`;
        }
        return `max-width: ${val}`;
      }
      return 'max-width';
    }

    // Sizing: Min Height
    if (group === 'Min Height') {
      if (cls === 'min-h-0') return 'min-height: 0px';
      if (cls === 'min-h-full') return 'min-height: 100%';
      if (cls === 'min-h-screen') return 'min-height: 100vh';
      return 'min-height';
    }

    // Sizing: Max Height
    if (group === 'Max Height') {
      const map: Record<string, string> = {
        'max-h-0': '0px',
        'max-h-40': `${formatRem(10)}`,
        'max-h-80': `${formatRem(20)}`,
        'max-h-full': '100%',
        'max-h-screen': '100vh',
      };
      if (cls in map) {
        const val = map[cls];
        if (/rem$/.test(val)) {
          const rem = parseFloat(val);
          return `max-height: ${val}; (${pxFromRem(rem)}px)`;
        }
        return `max-height: ${val}`;
      }
      return 'max-height';
    }

    // Position
    if (group === 'Position') {
      const map: Record<string, string> = {
        static: 'position: static',
        fixed: 'position: fixed',
        absolute: 'position: absolute',
        relative: 'position: relative',
        sticky: 'position: sticky',
      };
      // Only handle explicit position keywords here; allow offsets to fall back
      // to generic detection (top/right/bottom/left) instead of returning
      // a vague 'position' label.
      if (cls in map) return map[cls];
      return null;
    }

    // Z-Index
    if (group === 'Z-Index') {
      if (cls === 'z-auto') return 'z-index: auto';
      const m = cls.match(/^z-(-?\d+)$/);
      if (m) return `z-index: ${parseInt(m[1], 10)}`;
      return 'z-index';
    }

    // Opacity
    if (group === 'Opacity') {
      const m = cls.match(/^opacity-(\d{1,3})$/);
      if (m) return `opacity: ${Math.max(0, Math.min(100, parseInt(m[1], 10))) / 100}`;
      return 'opacity';
    }

    // Text Align
    if (group === 'Text Align') {
      const m = cls.match(/^text-(left|center|right|justify|start|end)$/);
      if (m) return `text-align: ${m[1]}`;
      return 'text-align';
    }

    // Transform toggles and helpers
    if (group === 'Transform') {
      if (cls === 'transform-none') return 'transform: none';
      if (cls === 'transform') return 'transform';
      if (cls === 'transform-gpu') return 'transform: translateZ(0)';
      if (cls === 'preserve-3d') return 'transform-style: preserve-3d';
      if (cls === 'backface-hidden') return 'backface-visibility: hidden';
      return 'transform';
    }

    // Scale
    if (group === 'Scale') {
      const mapPct = (s: string) => {
        const n = parseFloat(s);
        if (isNaN(n)) return null;
        return (n / 100).toString().replace(/\.0+$/, '');
      };
      let m = cls.match(/^scale-(\d+(?:\.\d+)?)$/);
      if (m) {
        const v = mapPct(m[1]);
        if (v != null) return `transform: scale(${v})`;
      }
      m = cls.match(/^scale-x-(\d+(?:\.\d+)?)$/);
      if (m) {
        const v = mapPct(m[1]);
        if (v != null) return `transform: scaleX(${v})`;
      }
      m = cls.match(/^scale-y-(\d+(?:\.\d+)?)$/);
      if (m) {
        const v = mapPct(m[1]);
        if (v != null) return `transform: scaleY(${v})`;
      }
      return 'transform: scale(...)';
    }

    // Rotate
    if (group === 'Rotate') {
      const m = cls.match(/^rotate-(-?\d+(?:\.\d+)?)$/);
      if (m) return `transform: rotate(${m[1]}deg)`;
      return 'transform: rotate(...)';
    }

    // Translate
    if (group === 'Translate') {
      const toRem = (s: string) => `${formatRem(parseFloat(s) * 0.25)}`;
      let m = cls.match(/^translate-x-(full)$/);
      if (m) return 'transform: translateX(100%)';
      m = cls.match(/^translate-y-(full)$/);
      if (m) return 'transform: translateY(100%)';
      m = cls.match(/^translate-x-(-?\d+(?:\.\d+)?)$/);
      if (m) return `transform: translateX(${toRem(m[1])})`;
      m = cls.match(/^translate-y-(-?\d+(?:\.\d+)?)$/);
      if (m) return `transform: translateY(${toRem(m[1])})`;
      return 'transform: translate(...)';
    }

    // Skew
    if (group === 'Skew') {
      let m = cls.match(/^skew-x-(-?\d+(?:\.\d+)?)$/);
      if (m) return `transform: skewX(${m[1]}deg)`;
      m = cls.match(/^skew-y-(-?\d+(?:\.\d+)?)$/);
      if (m) return `transform: skewY(${m[1]}deg)`;
      return 'transform: skew(...)';
    }

    // Origin
    if (group === 'Origin') {
      const val = cls.replace(/^origin-/, '').replace(/-/g, ' ');
      return `transform-origin: ${val}`;
    }

    // Text Decoration Line
    if (group === 'Text Decoration Line') {
      if (cls === 'underline') return 'text-decoration-line: underline';
      if (cls === 'overline') return 'text-decoration-line: overline';
      if (cls === 'line-through') return 'text-decoration-line: line-through';
      if (cls === 'no-underline') return 'text-decoration-line: none';
      return 'text-decoration-line';
    }

    // Text Decoration Style
    if (group === 'Text Decoration Style') {
      const m = cls.match(/^decoration-(solid|dashed|dotted|double|wavy)$/);
      if (m) return `text-decoration-style: ${m[1]}`;
      return 'text-decoration-style';
    }

    // Text Decoration Thickness
    if (group === 'Text Decoration Thickness') {
      if (cls === 'decoration-auto') return 'text-decoration-thickness: auto';
      if (cls === 'decoration-from-font') return 'text-decoration-thickness: from-font';
      const m = cls.match(/^decoration-(\d+)$/);
      if (m) return `text-decoration-thickness: ${parseInt(m[1], 10)}px`;
      return 'text-decoration-thickness';
    }

    // Text Underline Offset
    if (group === 'Text Underline Offset') {
      if (cls === 'underline-offset-auto') return 'text-underline-offset: auto';
      const m = cls.match(/^underline-offset-(\d+)$/);
      if (m) return `text-underline-offset: ${parseInt(m[1], 10)}px`;
      return 'text-underline-offset';
    }

    // Font Weight
    if (group === 'Font Weight') {
      const map: Record<string, string> = {
        'font-thin': '100',
        'font-extralight': '200',
        'font-light': '300',
        'font-normal': '400',
        'font-medium': '500',
        'font-semibold': '600',
        'font-bold': '700',
        'font-extrabold': '800',
        'font-black': '900',
      };
      if (cls in map) return `font-weight: ${map[cls]}`;
      return 'font-weight';
    }

    // Font Style
    if (group === 'Font Style') {
      if (cls === 'italic') return 'font-style: italic';
      if (cls === 'not-italic') return 'font-style: normal';
      return 'font-style';
    }

    // Text Size
    if (group === 'Text Size') {
      const map: Record<string, number> = {
        'text-xs': 0.75,
        'text-sm': 0.875,
        'text-base': 1,
        'text-lg': 1.125,
        'text-xl': 1.25,
        'text-2xl': 1.5,
        'text-3xl': 1.875,
        'text-4xl': 2.25,
        'text-5xl': 3,
        'text-6xl': 3.75,
        'text-7xl': 4.5,
        'text-8xl': 6,
        'text-9xl': 8,
      };
      if (cls in map) {
        const rem = map[cls];
        return `font-size: ${formatRem(rem)}; (${pxFromRem(rem)}px)`;
      }
      return 'font-size';
    }

    // Font Family
    if (group === 'Font Family') {
      if (cls === 'font-sans') return 'font-family: sans-serif';
      if (cls === 'font-serif') return 'font-family: serif';
      if (cls === 'font-mono') return 'font-family: monospace';
      return 'font-family';
    }

    // Font Smoothing
    if (group === 'Font Smoothing') {
      if (cls === 'antialiased') return '-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale';
      if (cls === 'subpixel-antialiased') return '-webkit-font-smoothing: auto; -moz-osx-font-smoothing: auto';
      return 'font-smoothing';
    }

    // Font Variant Numeric
    if (group === 'Font Variant Numeric') {
      const m = cls.match(/^(normal-nums|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions)$/);
      if (m) return `font-variant-numeric: ${m[1].replace('normal-nums','normal')}`;
      return 'font-variant-numeric';
    }

    // Letter Spacing
    if (group === 'Letter Spacing') {
      const map: Record<string, string> = {
        'tracking-tighter': '-0.05em',
        'tracking-tight': '-0.025em',
        'tracking-normal': '0em',
        'tracking-wide': '0.025em',
        'tracking-wider': '0.05em',
        'tracking-widest': '0.1em',
      };
      if (cls in map) return `letter-spacing: ${map[cls]}`;
      return 'letter-spacing';
    }

    // Line Clamp
    if (group === 'Line Clamp') {
      if (cls === 'line-clamp-none') return '-webkit-line-clamp: unset';
      const m = cls.match(/^line-clamp-(\d+)$/);
      if (m) return `-webkit-line-clamp: ${parseInt(m[1],10)}; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical`;
      return 'line-clamp';
    }

    // Line Height
    if (group === 'Line Height') {
      const map: Record<string, number> = {
        'leading-none': 1,
        'leading-tight': 1.25,
        'leading-snug': 1.375,
        'leading-normal': 1.5,
        'leading-relaxed': 1.625,
        'leading-loose': 2,
      };
      if (cls in map) return `line-height: ${map[cls]}`;
      return 'line-height';
    }

    // Text Overflow
    if (group === 'Text Overflow') {
      if (cls === 'truncate') return 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap';
      if (cls === 'text-ellipsis') return 'text-overflow: ellipsis';
      if (cls === 'text-clip') return 'text-overflow: clip';
      return 'text-overflow';
    }

    // Text Indent
    if (group === 'Text Indent') {
      if (cls === 'indent-0') return 'text-indent: 0px';
      if (cls === 'indent-px') return 'text-indent: 1px';
      const m = cls.match(/^indent-(\d+(?:\.\d+)?)$/);
      if (m) {
        const rem = parseFloat(m[1]) * 0.25;
        return `text-indent: ${formatRem(rem)}; (${pxFromRem(rem)}px)`;
      }
      return 'text-indent';
    }

    // Vertical Align
    if (group === 'Vertical Align') {
      const m = cls.match(/^align-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)$/);
      if (m) return `vertical-align: ${m[1]}`;
      return 'vertical-align';
    }

    // White Space
    if (group === 'White Space') {
      const m = cls.match(/^whitespace-(normal|nowrap|pre|pre-line|pre-wrap)$/);
      if (m) return `white-space: ${m[1]}`;
      return 'white-space';
    }

    // Word Break
    if (group === 'Word Break') {
      if (cls === 'break-normal') return 'word-break: normal';
      if (cls === 'break-words') return 'overflow-wrap: anywhere';
      if (cls === 'break-all') return 'word-break: break-all';
      if (cls === 'break-keep') return 'word-break: keep-all';
      return 'word-break';
    }

    // Hyphens
    if (group === 'Hyphens') {
      const m = cls.match(/^hyphens-(none|manual|auto)$/);
      if (m) return `hyphens: ${m[1]}`;
      return 'hyphens';
    }

    // Content
    if (group === 'Content') {
      if (cls === 'content-none') return 'content: none';
      return 'content';
    }

    // Cursor
    if (group === 'Cursor') {
      const m = cls.match(/^cursor-(.+)$/);
      if (m) return `cursor: ${m[1]}`;
      return 'cursor';
    }

    // Text Transform
    if (group === 'Text Transform') {
      if (cls === 'uppercase') return 'text-transform: uppercase';
      if (cls === 'lowercase') return 'text-transform: lowercase';
      if (cls === 'capitalize') return 'text-transform: capitalize';
      if (cls === 'normal-case') return 'text-transform: none';
      return 'text-transform';
    }

    // Visibility
    if (group === 'Visibility') {
      if (cls === 'visible') return 'visibility: visible';
      if (cls === 'invisible') return 'visibility: hidden';
      if (cls === 'collapse') return 'visibility: collapse';
      return 'visibility';
    }

    // Text Wrap
    if (group === 'Text Wrap') {
      if (cls === 'text-wrap') return 'text-wrap: wrap';
      if (cls === 'text-nowrap') return 'text-wrap: nowrap';
      if (cls === 'text-balance') return 'text-wrap: balance';
      if (cls === 'text-pretty') return 'text-wrap: pretty';
      return 'text-wrap';
    }

    // List Style Type
    if (group === 'List Style Type') {
      if (cls === 'list-none') return 'list-style-type: none';
      if (cls === 'list-disc') return 'list-style-type: disc';
      if (cls === 'list-decimal') return 'list-style-type: decimal';
      return 'list-style-type';
    }

    // List Style Position
    if (group === 'List Style Position') {
      if (cls === 'list-inside') return 'list-style-position: inside';
      if (cls === 'list-outside') return 'list-style-position: outside';
      return 'list-style-position';
    }

    // User Select
    if (group === 'User Select') {
      const m = cls.match(/^select-(none|text|all|auto)$/);
      if (m) return `user-select: ${m[1]}`;
      return 'user-select';
    }

    // Pointer Events
    if (group === 'Pointer Events') {
      const m = cls.match(/^pointer-events-(none|auto)$/);
      if (m) return `pointer-events: ${m[1]}`;
      return 'pointer-events';
    }

    // Overflow
    if (group === 'Overflow') {
      let m = cls.match(/^overflow-(visible|hidden|clip|scroll|auto)$/);
      if (m) return `overflow: ${m[1]}`;
      m = cls.match(/^overflow-x-(visible|hidden|clip|scroll|auto)$/);
      if (m) return `overflow-x: ${m[1]}`;
      m = cls.match(/^overflow-y-(visible|hidden|clip|scroll|auto)$/);
      if (m) return `overflow-y: ${m[1]}`;
      return 'overflow';
    }

    // Transition duration / delay
    if (group === 'Duration') {
      const m = cls.match(/^duration-(\d+)$/);
      if (m) return `transition-duration: ${parseInt(m[1], 10)}ms`;
      return 'transition-duration';
    }
    if (group === 'Delay') {
      const m = cls.match(/^delay-(\d+)$/);
      if (m) return `transition-delay: ${parseInt(m[1], 10)}ms`;
      return 'transition-delay';
    }

    // Transition Property
    if (group === 'Transition Property') {
      if (cls === 'transition-none') return 'transition-property: none';
      if (cls === 'transition') return 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter';
      if (cls === 'transition-colors') return 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke';
      if (cls === 'transition-opacity') return 'transition-property: opacity';
      if (cls === 'transition-shadow') return 'transition-property: box-shadow';
      if (cls === 'transition-transform') return 'transition-property: transform';
      return 'transition-property';
    }

    // Timing Function
    if (group === 'Timing Function') {
      const map: Record<string, string> = {
        'ease-linear': 'linear',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      };
      if (cls in map) return `transition-timing-function: ${map[cls]}`;
      return 'transition-timing-function';
    }

    // Animation
    if (group === 'Animation') {
      const map: Record<string, string> = {
        'animate-none': 'none',
        'animate-spin': 'spin 1s linear infinite',
        'animate-ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'animate-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'animate-bounce': 'bounce 1s infinite',
      };
      if (cls in map) return `animation: ${map[cls]}`;
      return 'animation';
    }

    // Table layout / collapse / caption-side
    if (group === 'Table Layout') {
      if (cls === 'table-auto') return 'table-layout: auto';
      if (cls === 'table-fixed') return 'table-layout: fixed';
      return 'table-layout';
    }
    if (group === 'Border Collapse') {
      if (cls === 'border-collapse') return 'border-collapse: collapse';
      if (cls === 'border-separate') return 'border-collapse: separate';
      return 'border-collapse';
    }
    if (group === 'Caption Side') {
      if (cls === 'caption-top') return 'caption-side: top';
      if (cls === 'caption-bottom') return 'caption-side: bottom';
      return 'caption-side';
    }

    // Layout helpers
    if (group === 'Aspect Ratio') {
      if (cls === 'aspect-auto') return 'aspect-ratio: auto';
      if (cls === 'aspect-square') return 'aspect-ratio: 1 / 1';
      if (cls === 'aspect-video') return 'aspect-ratio: 16 / 9';
      return 'aspect-ratio';
    }
    if (group === 'Columns') {
      const m = cls.match(/^columns-(\d+)$/);
      if (m) return `column-count: ${parseInt(m[1], 10)}`;
      return 'column-count';
    }
    if (group === 'Break Inside') {
      const m = cls.match(/^break-inside-(auto|avoid|avoid-page|avoid-column)$/);
      if (m) return `break-inside: ${m[1]}`;
      return 'break-inside';
    }
    if (group === 'Box Decoration Break') {
      const m = cls.match(/^box-decoration-(slice|clone)$/);
      if (m) return `box-decoration-break: ${m[1]}`;
      return 'box-decoration-break';
    }
    if (group === 'Box Sizing') {
      if (cls === 'box-border') return 'box-sizing: border-box';
      if (cls === 'box-content') return 'box-sizing: content-box';
      return 'box-sizing';
    }
    if (group === 'Float') {
      const m = cls.match(/^float-(left|right|none)$/);
      if (m) return `float: ${m[1]}`;
      return 'float';
    }
    if (group === 'Clear') {
      const m = cls.match(/^clear-(left|right|both|none)$/);
      if (m) return `clear: ${m[1]}`;
      return 'clear';
    }
    if (group === 'Isolation') {
      if (cls === 'isolation-auto') return 'isolation: auto';
      if (cls === 'isolate') return 'isolation: isolate';
      return 'isolation';
    }
    if (group === 'Object Fit') {
      const m = cls.match(/^object-(contain|cover|fill|none|scale-down)$/);
      if (m) return `object-fit: ${m[1]}`;
      return 'object-fit';
    }
    if (group === 'Object Position') {
      const val = cls.replace(/^object-/, '').replace(/-/g, ' ');
      return `object-position: ${val}`;
    }
    if (group === 'Overscroll Behavior') {
      if (cls === 'overscroll-auto') return 'overscroll-behavior: auto';
      if (cls === 'overscroll-contain') return 'overscroll-behavior: contain';
      if (cls === 'overscroll-none') return 'overscroll-behavior: none';
      if (cls === 'overscroll-x-none') return 'overscroll-behavior-x: none';
      if (cls === 'overscroll-y-none') return 'overscroll-behavior-y: none';
      return 'overscroll-behavior';
    }

    // Border Width — provide explicit mapping to ensure value even when baseline equals
    if (group === 'Border Width') {
      const map: Record<string, string> = {
        border: '1px',
        'border-0': '0px',
        'border-2': '2px',
        'border-4': '4px',
        'border-8': '8px',
      };
      if (cls in map) return `border-width: ${map[cls]}`;
      return 'border-width';
    }

    // Border Style
    if (group === 'Border Style') {
      const m = cls.match(/^border-(solid|dashed|dotted|double|hidden|none)$/);
      if (m) return `border-style: ${m[1]}`;
      return 'border-style';
    }

    // Radius — map to Tailwind default theme values
    if (group === 'Radius') {
      const map: Record<string, string> = {
        'rounded-none': '0px',
        rounded: '0.25rem',
        'rounded-sm': '0.125rem',
        'rounded-md': '0.375rem',
        'rounded-lg': '0.5rem',
        'rounded-xl': '0.75rem',
        'rounded-2xl': '1rem',
        'rounded-3xl': '1.5rem',
        'rounded-full': '9999px',
      };
      if (cls in map) return `border-radius: ${map[cls]}`;
      return 'border-radius';
    }

    // Shadow — explicitly handle none, others rely on computed fallback
    if (group === 'Shadow') {
      if (cls === 'shadow-none') return 'box-shadow: none';
      if (cls === 'shadow-inner') return 'box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.05)';
      // leave other shadows to generic computed detection
      return null;
    }

    // SVG
    if (group === 'Fill') return 'fill';
    if (group === 'Stroke') return 'stroke';
    if (group === 'Stroke Width') {
      const m = cls.match(/^stroke-(\d+)$/);
      if (m) return `stroke-width: ${parseInt(m[1], 10)}`;
      return 'stroke-width';
    }

    if (group === 'Appearance') {
      if (cls === 'appearance-none') return 'appearance: none';
      if (cls === 'appearance-auto') return 'appearance: auto';
      return 'appearance';
    }

    if (group === 'Accent Color') {
      // Will try to compute dynamically via input element; fallback label
      return 'accent-color';
    }

    // Outline Width
    if (group === 'Outline Width') {
      const m = cls.match(/^outline-(\d+)$/);
      if (m) return `outline-width: ${parseInt(m[1], 10)}px`;
      if (cls === 'outline-0') return 'outline-width: 0px';
      return 'outline-width';
    }

    // Outline Style
    if (group === 'Outline Style') {
      if (cls === 'outline') return 'outline-style: solid';
      const m = cls.match(/^outline-(dashed|dotted|double|none)$/);
      if (m) return `outline-style: ${m[1]}`;
      return 'outline-style';
    }

    // Outline Offset
    if (group === 'Outline Offset') {
      const m = cls.match(/^outline-offset-(\d+)$/);
      if (m) return `outline-offset: ${parseInt(m[1], 10)}px`;
      return 'outline-offset';
    }

    // Effects: Mix Blend Mode / Background Blend Mode
    if (cat === 'Effects' && group === 'Mix Blend Mode') {
      const m = cls.match(/^mix-blend-(.+)$/);
      if (m) return `mix-blend-mode: ${m[1].replace(/-/g, ' ')}`;
      return 'mix-blend-mode';
    }
    if (cat === 'Effects' && group === 'Background Blend Mode') {
      const m = cls.match(/^bg-blend-(.+)$/);
      if (m) return `background-blend-mode: ${m[1].replace(/-/g, ' ')}`;
      return 'background-blend-mode';
    }

    // Accessibility
    if (cat === 'Accessibility') {
      if (group === 'Screen Readers') {
        if (cls === 'sr-only') {
          return 'position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0, 0, 0, 0); white-space:nowrap; border-width:0';
        }
        if (cls === 'not-sr-only') {
          return 'position:static; width:auto; height:auto; padding:0; margin:0; overflow:visible; clip:auto; white-space:normal; border-width:0';
        }
        return 'screen-readers';
      }
      if (group === 'Forced Color Adjust') {
        if (cls === 'forced-color-adjust-auto') return 'forced-color-adjust: auto';
        if (cls === 'forced-color-adjust-none') return 'forced-color-adjust: none';
        return 'forced-color-adjust';
      }
    }

    // Background Attachment
    if (group === 'Background Attachment') {
      if (cls === 'bg-fixed') return 'background-attachment: fixed';
      if (cls === 'bg-local') return 'background-attachment: local';
      if (cls === 'bg-scroll') return 'background-attachment: scroll';
      return 'background-attachment';
    }

    // Gradients — Direction
    if (cat === 'Gradients' && group === 'Direction') {
      const dir = (
        cls === 'bg-gradient-to-t' ? 'to top' :
        cls === 'bg-gradient-to-tr' ? 'to top right' :
        cls === 'bg-gradient-to-r' ? 'to right' :
        cls === 'bg-gradient-to-br' ? 'to bottom right' :
        cls === 'bg-gradient-to-b' ? 'to bottom' :
        cls === 'bg-gradient-to-bl' ? 'to bottom left' :
        cls === 'bg-gradient-to-l' ? 'to left' :
        cls === 'bg-gradient-to-tl' ? 'to top left' : null
      );
      if (dir) return `background-image: linear-gradient(${dir}, var(--tw-gradient-stops))`;
      return 'background-image';
    }

    // Gradients — Color Stops (From/Via/To)
    if (cat === 'Gradients' && (group === 'From' || group === 'Via' || group === 'To')) {
      if (typeof window !== 'undefined') {
        try {
          const el = document.createElement('div');
          el.className = `bg-gradient-to-r ${cls}`;
          el.style.position = 'absolute';
          el.style.left = '-9999px';
          el.style.top = '-9999px';
          document.body.appendChild(el);
          const cs = getComputedStyle(el);
          const parts: string[] = [];
          const from = cs.getPropertyValue('--tw-gradient-from').trim();
          const via = cs.getPropertyValue('--tw-gradient-via').trim();
          const to = cs.getPropertyValue('--tw-gradient-to').trim();
          const stops = cs.getPropertyValue('--tw-gradient-stops').trim();
          if (from) parts.push(`--tw-gradient-from: ${from}`);
          if (via) parts.push(`--tw-gradient-via: ${via}`);
          if (to) parts.push(`--tw-gradient-to: ${to}`);
          if (stops) parts.push(`--tw-gradient-stops: ${stops}`);
          document.body.removeChild(el);
          if (parts.length) return parts.join('; ');
        } catch {}
      }
      // Fallback when not in browser or variables unavailable
      if (group === 'From') return '--tw-gradient-from';
      if (group === 'Via') return '--tw-gradient-via';
      if (group === 'To') return '--tw-gradient-to';
    }

    // Background Clip
    if (group === 'Background Clip') {
      if (cls === 'bg-clip-border') return 'background-clip: border-box';
      if (cls === 'bg-clip-padding') return 'background-clip: padding-box';
      if (cls === 'bg-clip-content') return 'background-clip: content-box';
      if (cls === 'bg-clip-text') return 'background-clip: text';
      return 'background-clip';
    }

    // Background Image
    if (group === 'Background Image') {
      if (cls === 'bg-none') return 'background-image: none';
      const dir = (
        cls === 'bg-gradient-to-t' ? 'to top' :
        cls === 'bg-gradient-to-tr' ? 'to top right' :
        cls === 'bg-gradient-to-r' ? 'to right' :
        cls === 'bg-gradient-to-br' ? 'to bottom right' :
        cls === 'bg-gradient-to-b' ? 'to bottom' :
        cls === 'bg-gradient-to-bl' ? 'to bottom left' :
        cls === 'bg-gradient-to-l' ? 'to left' :
        cls === 'bg-gradient-to-tl' ? 'to top left' : null
      );
      if (dir) return `background-image: linear-gradient(${dir}, var(--tw-gradient-stops))`;
      return 'background-image';
    }

    // Background Origin
    if (group === 'Background Origin') {
      if (cls === 'bg-origin-border') return 'background-origin: border-box';
      if (cls === 'bg-origin-padding') return 'background-origin: padding-box';
      if (cls === 'bg-origin-content') return 'background-origin: content-box';
      return 'background-origin';
    }

    // Background Position
    if (group === 'Background Position') {
      const map: Record<string, string> = {
        'bg-bottom': 'bottom',
        'bg-center': 'center',
        'bg-left': 'left',
        'bg-left-bottom': 'left bottom',
        'bg-left-top': 'left top',
        'bg-right': 'right',
        'bg-right-bottom': 'right bottom',
        'bg-right-top': 'right top',
        'bg-top': 'top',
      };
      if (cls in map) return `background-position: ${map[cls]}`;
      return 'background-position';
    }

    // Background Repeat
    if (group === 'Background Repeat') {
      const map: Record<string, string> = {
        'bg-no-repeat': 'no-repeat',
        'bg-repeat': 'repeat',
        'bg-repeat-x': 'repeat-x',
        'bg-repeat-y': 'repeat-y',
        'bg-repeat-round': 'round',
        'bg-repeat-space': 'space',
      };
      if (cls in map) return `background-repeat: ${map[cls]}`;
      return 'background-repeat';
    }

    // Background Size
    if (group === 'Background Size') {
      if (cls === 'bg-auto') return 'background-size: auto';
      if (cls === 'bg-cover') return 'background-size: cover';
      if (cls === 'bg-contain') return 'background-size: contain';
      return 'background-size';
    }

    // Filter toggles
    if (group === 'Filter') {
      if (cls === 'filter-none') return 'filter: none';
      if (cls === 'filter') return 'filter';
      return 'filter';
    }
    if (group === 'Backdrop Filter') {
      if (cls === 'backdrop-filter-none') return 'backdrop-filter: none';
      if (cls === 'backdrop-filter') return 'backdrop-filter';
      return 'backdrop-filter';
    }

    // Filters — explicit mappings so values always show
    if (group === 'Blur') {
      const map: Record<string, string> = {
        'blur-none': '0px',
        'blur-sm': '4px',
        blur: '8px',
        'blur-md': '12px',
        'blur-lg': '16px',
        'blur-xl': '24px',
        'blur-2xl': '40px',
        'blur-3xl': '64px',
      };
      if (cls in map) return `filter: blur(${map[cls]})`;
      return 'filter: blur(...)';
    }
    if (group === 'Brightness') {
      const m = cls.match(/^brightness-(\d{1,3})$/);
      if (m) return `filter: brightness(${parseInt(m[1], 10) / 100})`;
      return 'filter: brightness(...)';
    }
    if (group === 'Contrast') {
      const m = cls.match(/^contrast-(\d{1,3})$/);
      if (m) return `filter: contrast(${parseInt(m[1], 10) / 100})`;
      return 'filter: contrast(...)';
    }
    if (group === 'Grayscale') {
      if (cls === 'grayscale') return 'filter: grayscale(100%)';
      if (cls === 'grayscale-0') return 'filter: grayscale(0)';
      return 'filter: grayscale(...)';
    }
    if (group === 'Invert') {
      if (cls === 'invert') return 'filter: invert(100%)';
      if (cls === 'invert-0') return 'filter: invert(0)';
      return 'filter: invert(...)';
    }
    if (group === 'Sepia') {
      if (cls === 'sepia') return 'filter: sepia(100%)';
      if (cls === 'sepia-0') return 'filter: sepia(0)';
      return 'filter: sepia(...)';
    }
    if (group === 'Saturate') {
      const m = cls.match(/^saturate-(\d{1,3})$/);
      if (m) return `filter: saturate(${parseInt(m[1], 10) / 100})`;
      return 'filter: saturate(...)';
    }
    if (group === 'Hue Rotate') {
      const m = cls.match(/^hue-rotate-(-?\d+(?:\.\d+)?)$/);
      if (m) return `filter: hue-rotate(${m[1]}deg)`;
      return 'filter: hue-rotate(...)';
    }
    if (group === 'Drop Shadow') {
      if (cls === 'drop-shadow-none') return 'filter: none';
      // Specific kernels vary by theme; show a generic hint
      return 'filter: drop-shadow(...)';
    }

    // Interactivity — Scroll & Touch & Will Change & Color Scheme
    if (group === 'Scroll Behavior') {
      if (cls === 'scroll-auto') return 'scroll-behavior: auto';
      if (cls === 'scroll-smooth') return 'scroll-behavior: smooth';
      return 'scroll-behavior';
    }
    if (group === 'Scroll Snap Align') {
      const m = cls.match(/^snap-(start|end|center|align-none)$/);
      if (m) {
        const val = m[1] === 'align-none' ? 'none' : m[1];
        return `scroll-snap-align: ${val}`;
      }
      return 'scroll-snap-align';
    }
    if (group === 'Scroll Snap Type') {
      if (cls === 'snap-none') return 'scroll-snap-type: none';
      if (cls === 'snap-x') return 'scroll-snap-type: x var(--tw-scroll-snap-strictness)';
      if (cls === 'snap-y') return 'scroll-snap-type: y var(--tw-scroll-snap-strictness)';
      if (cls === 'snap-both') return 'scroll-snap-type: both var(--tw-scroll-snap-strictness)';
      if (cls === 'snap-mandatory') return '--tw-scroll-snap-strictness: mandatory';
      if (cls === 'snap-proximity') return '--tw-scroll-snap-strictness: proximity';
      return 'scroll-snap-type';
    }
    if (group === 'Scroll Snap Stop') {
      if (cls === 'snap-normal') return 'scroll-snap-stop: normal';
      if (cls === 'snap-always') return 'scroll-snap-stop: always';
      return 'scroll-snap-stop';
    }
    if (group === 'Touch Action') {
      const m = cls.match(/^touch-(auto|none|pan-x|pan-y|manipulation)$/);
      if (m) return `touch-action: ${m[1]}`;
      return 'touch-action';
    }
    if (group === 'Will Change') {
      if (cls === 'will-change-auto') return 'will-change: auto';
      if (cls === 'will-change-scroll') return 'will-change: scroll-position';
      if (cls === 'will-change-contents') return 'will-change: contents';
      if (cls === 'will-change-transform') return 'will-change: transform';
      return 'will-change';
    }
    if (group === 'Color Scheme') {
      const m = cls.match(/^color-scheme-(auto|dark|light)$/);
      if (m) return `color-scheme: ${m[1]}`;
      return 'color-scheme';
    }

    // Fallback to group hint
    return null;
  }

  function SpacingItem({ cls, kind, keyName }: { cls: string; kind: 'padding'|'margin'|'gap'; keyName: string; }) {
    const val = parseSpacingValue(cls);
    if (val == null) {
      // handle auto
      if (/(\-auto)$/.test(cls)) {
        const label = spacingGroupLabel(kind, keyName);
        return (
          <li className="py-1">
            <button type="button" onClick={() => copy(cls)} className="w-full text-left font-mono text-[11px] leading-5 hover:underline">
              <span className="truncate">{copied === cls ? 'Copied' : cls}</span>
            </button>
            <button type="button" onClick={() => copy(`${label}: auto`)} className="mt-0.5 w-full text-left font-mono text-[11px] leading-5 text-zinc-600 hover:underline">
              {copied === `${label}: auto` ? 'Copied' : `${label}: auto`}
            </button>
          </li>
        );
      }
      return (
        <li className="py-1">
          <button type="button" onClick={() => copy(cls)} className="w-full text-left font-mono text-[11px] leading-5 hover:underline">
            <span className="truncate">{copied === cls ? 'Copied' : cls}</span>
          </button>
        </li>
      );
    }
    const rem = val * 0.25;
    const label = spacingGroupLabel(kind, keyName);
    const cssText = `${label}: ${formatRem(rem)}; (${pxFromRem(rem)}px)`;
    return (
      <li className="py-1">
        <button type="button" onClick={() => copy(cls)} className="w-full text-left font-mono text-[11px] leading-5 hover:underline">
          <span className="truncate">{copied === cls ? 'Copied' : cls}</span>
        </button>
        <button type="button" onClick={() => copy(cssText)} className="mt-0.5 w-full text-left font-mono text-[11px] leading-5 text-zinc-600 hover:underline">
          {copied === cssText ? 'Copied' : (
            <>
              {label}: {formatRem(rem)}; <span className="text-zinc-500">({pxFromRem(rem)}px)</span>
            </>
          )}
        </button>
      </li>
    );
  }

  function colorDotClass(group: string, cls: string): string | null {
    if (group === 'Background Color') return cls; // bg-*
    if (group === 'Text Color') return cls.replace(/^text-/, 'bg-');
    if (group === 'Border Color') return cls.replace(/^border-/, 'bg-');
    return null;
  }

  const columnMap: Record<string, number> = {
    Colors: 0,
    Gradients: 0,
    Typography: 0,
    Backgrounds: 0,
    Spacing: 1,
    Sizing: 1,
    Layout: 1,
    'Borders & Effects': 2,
    Effects: 2,
    Interactivity: 2,
    Transforms: 1,
    Filters: 1,
    'Transitions & Animation': 2,
    Tables: 2,
    SVG: 2,
    Accessibility: 0,
  };
  const columns: JSX.Element[][] = [[], [], []];

  filtered.forEach((cat) => {
          // Special rendering for Spacing to group margins and paddings
          const isSpacing = cat.name === 'Spacing';
          const marginKeys = ['m','mx','my','mt','mr','mb','ml'];
          const paddingKeys = ['p','px','py','pt','pr','pb','pl'];
          const byName = Object.fromEntries(cat.groups.map(g => [g.name, g]));

          const marginCount = marginKeys.reduce((n,k)=> n + ((byName[k]?.classes.length)||0), 0);
          const paddingCount = paddingKeys.reduce((n,k)=> n + ((byName[k]?.classes.length)||0), 0);
          const card = (
            <section key={cat.name} className="inline-block w-full align-top mb-8 break-inside-avoid">
              <header className=" py-1.5 text-sm font-semibold text-stone-500">
                {cat.name}
              </header>
              <div className="divide-y divide-zinc-100 border-y border-zinc-100 mt-4 w-full">
                {isSpacing ? (
                  <>
                    {/* Margin wrapper */}
                    {(() => {
                      const parentKey = `${cat.name}:margin`;
                      const isOpenParent = !!open[parentKey];
                      return (
                        <div>
                          <button
                            type="button"
                            onClick={() => toggle(parentKey)}
                            className="w-full flex items-center justify-between  py-2 text-sm "
                            aria-expanded={isOpenParent}
                          >
                            <span className="text-zinc-700">margin</span>
                            <span className="flex items-center gap-2 text-xs text-zinc-500">
                              <svg className={`size-3 transition-transform ${isOpenParent ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                            </span>
                          </button>
                          {isOpenParent && (
                            <div className=" pb-3 pt-1 space-y-1">
                              {groupDescription(cat.name, 'margin') && (
                                <p className="text-xs italic text-zinc-600">{groupDescription(cat.name, 'margin')}</p>
                              )}
                              <div className="flex items-center justify-between text-xs text-zinc-500 mt-4">
                                <a href="https://tailwindcss.com/docs/margin" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Docs</a>
                                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-zinc-100 border border-zinc-200">{marginCount}</span>
                              </div>
                              {marginKeys.map((k) => {
                                const g = byName[k];
                                if (!g) return null;
                                const key = `${cat.name}:${k}`;
                                const isOpen = !!open[key];
                                return (
                                  <div key={k} className="">
                                    <button type="button" onClick={() => toggle(key)} className="w-full flex items-center justify-between px-2 py-1.5 text-sm" aria-expanded={isOpen}>
                                      <span className="text-zinc-700">{k}</span>
                                      <span className="flex items-center gap-2 text-xs text-zinc-500">
                                        <svg className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                                      </span>
                                    </button>
                                    {isOpen && (
                                      <div className="pl-2">
                                        <div>
                                          <div className="flex items-center justify-end text-xs text-zinc-500 mb-1">
                                            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-zinc-100 border border-zinc-200">{g.classes.length}</span>
                                          </div>
                                          <ul className="divide-y divide-zinc-100 border-y border-zinc-100 mt-4 max-h-72 overflow-y-auto pr-1">
                                             {g.classes.map((cls) => (
                                               <SpacingItem key={cls} cls={cls} kind="margin" keyName={k} />
                                             ))}
                                           </ul>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Padding wrapper */}
                    {(() => {
                      const parentKey = `${cat.name}:padding`;
                      const isOpenParent = !!open[parentKey];
                      return (
                        <div>
                          <button type="button" onClick={() => toggle(parentKey)} className="w-full flex items-center justify-between  py-2 text-sm " aria-expanded={isOpenParent}>
                            <span className="text-zinc-700">padding</span>
                            <span className="flex items-center gap-2 text-xs text-zinc-500">
                              <svg className={`size-3 transition-transform ${isOpenParent ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                            </span>
                          </button>
                          {isOpenParent && (
                            <div className=" pb-3 pt-1 space-y-1">
                              {groupDescription(cat.name, 'padding') && (
                                <p className="text-xs italic text-zinc-600">{groupDescription(cat.name, 'padding')}</p>
                              )}
                              <div className="flex items-center justify-between text-xs text-zinc-500 mt-4">
                                <a href="https://tailwindcss.com/docs/padding" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Docs</a>
                                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-zinc-100 border border-zinc-200">{paddingCount}</span>
                              </div>
                              {paddingKeys.map((k) => {
                                const g = byName[k];
                                if (!g) return null;
                                const key = `${cat.name}:${k}`;
                                const isOpen = !!open[key];
                                return (
                                  <div key={k}>
                                    <button type="button" onClick={() => toggle(key)} className="w-full flex items-center justify-between px-2 py-1.5 text-sm" aria-expanded={isOpen}>
                                      <span className="text-zinc-700">{k}</span>
                                      <span className="flex items-center gap-2 text-xs text-zinc-500">
                                        <svg className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                                      </span>
                                    </button>
                                    {isOpen && (
                                      <div className="pl-2">
                                        <div>
                                          <div className="flex items-center justify-end text-xs text-zinc-500 mb-1">
                                            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-zinc-100 border border-zinc-200">{g.classes.length}</span>
                                          </div>
                                           <ul className="divide-y divide-zinc-100 border-y border-zinc-100 mt-4 max-h-72 overflow-y-auto pr-1">
                                             {g.classes.map((cls) => (
                                               <SpacingItem key={cls} cls={cls} kind="padding" keyName={k} />
                                             ))}
                                           </ul>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Gap remains as a simple group if present */}
                    {byName['gap'] && (() => {
                      const g = byName['gap'];
                      const key = `${cat.name}:gap`;
                      const isOpen = !!open[key];
                      return (
                        <div>
                           <button type="button" onClick={() => toggle(key)} className="w-full flex items-center justify-between py-2 text-sm" aria-expanded={isOpen}>
                            <span className="text-zinc-700">gap</span>
                            <span className="flex items-center gap-2 text-xs text-zinc-500">
                              <svg className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                            </span>
                          </button>
                          {isOpen && (
                             <div className=" pb-3 pt-1">
                              {groupDescription(cat.name, 'gap') && (
                                <p className="text-xs italic text-zinc-600">{groupDescription(cat.name, 'gap')}</p>
                              )}
                              <div className="flex items-center justify-between text-xs text-zinc-500 mt-4">
                                <a href="https://tailwindcss.com/docs/gap" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Docs</a>
                                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-zinc-100 border border-zinc-200">{g.classes.length}</span>
                              </div>
                               <div>
                                  <ul className="divide-y divide-zinc-100 border-y border-zinc-100 mt-4 max-h-72 overflow-y-auto pr-1">
                                    {g.classes.map((cls) => (
                                      <SpacingItem key={cls} cls={cls} kind="gap" keyName="gap" />
                                    ))}
                                  </ul>
                               </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  cat.groups.map((g) => {
                    const key = `${cat.name}:${g.name}`;
                    const isOpen = !!open[key];
                    return (
                      <div key={g.name} className="">
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between py-2 text-sm"
                          aria-expanded={isOpen}
                        >
                          <span className="text-zinc-700">{g.name}</span>
                          <span className="flex items-center gap-2 text-xs text-zinc-500">
                            <svg className={`size-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                          </span>
                        </button>
                        {isOpen && (
                          <div className=" pb-3 pt-1">
                            {groupDescription(cat.name, g.name) && (
                              <p className="text-xs italic text-zinc-600">{groupDescription(cat.name, g.name) as string}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-zinc-500 mt-4">
                              {docsUrl(cat.name, g.name) && (
                                <a
                                  href={docsUrl(cat.name, g.name) as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:no-underline"
                                  title="Open Tailwind docs"
                                >
                                  Docs
                                </a>
                              )}
                              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-zinc-100 border border-zinc-200">{g.classes.length}</span>
                            </div>
                            <div>
                              <ul className="divide-y divide-zinc-100 border-y border-zinc-100 mt-4 max-h-72 overflow-y-auto pr-1 text-[11px] leading-5 font-mono">
                                {g.classes.map((cls) => {
                                  const dot = colorDotClass(g.name, cls);
                                  const dyn = typeof window !== 'undefined' ? ((): string | null => {
                                    // dynamic color read
                                    let value: string | null = null;
                                    let propName = '';
                                    if (g.name === 'Background Color') {
                                      propName = 'background-color';
                                      value = ((): string | null => {
                                        const el = document.createElement('div');
                                        el.className = cls;
                                        el.style.position = 'absolute';
                                        el.style.left = '-9999px';
                                        el.style.top = '-9999px';
                                        document.body.appendChild(el);
                                        const v = getComputedStyle(el).backgroundColor;
                                        document.body.removeChild(el);
                                        return v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' ? v : null;
                                      })();
                                    } else if (g.name === 'Text Color') {
                                      propName = 'color';
                                      value = ((): string | null => {
                                        const el = document.createElement('div');
                                        el.className = cls;
                                        el.style.position = 'absolute';
                                        el.style.left = '-9999px';
                                        el.style.top = '-9999px';
                                        document.body.appendChild(el);
                                        const v = getComputedStyle(el).color;
                                        document.body.removeChild(el);
                                        return v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' ? v : null;
                                      })();
                                    } else if (g.name === 'Border Color') {
                                      propName = 'border-color';
                                      value = ((): string | null => {
                                        const el = document.createElement('div');
                                        el.className = `border ${cls}`;
                                        el.style.position = 'absolute';
                                        el.style.left = '-9999px';
                                        el.style.top = '-9999px';
                                        document.body.appendChild(el);
                                        const v = getComputedStyle(el).borderTopColor;
                                        document.body.removeChild(el);
                                        return v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' ? v : null;
                                      })();
                                    } else if (g.name === 'Outline Color') {
                                      propName = 'outline-color';
                                      value = ((): string | null => {
                                        const el = document.createElement('div');
                                        el.className = cls;
                                        el.style.position = 'absolute';
                                        el.style.left = '-9999px';
                                        el.style.top = '-9999px';
                                        document.body.appendChild(el);
                                        const v = getComputedStyle(el).outlineColor as any;
                                        document.body.removeChild(el);
                                        return v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' ? v : null;
                                      })();
                                    }
                                    return value ? `${propName}: ${value}` : null;
                                  })() : null;
                                  const detail = dyn || cssDetail(cat.name, g.name, cls) || (typeof window !== 'undefined' ? genericCssDetail(cls) : null);
                                  const isColor = g.name === 'Background Color' || g.name === 'Text Color' || g.name === 'Border Color';
                                  return (
                                    <li key={cls} className="py-1">
                                      <button
                                        type="button"
                                        onClick={() => copy(cls)}
                                        className="w-full flex items-center gap-2 text-left hover:underline"
                                      >
                                        {dot && <span className={`inline-block size-3 rounded-full ring-1 ring-zinc-200 shrink-0 ${dot}`} />}
                                        <span className="truncate">{copied === cls ? 'Copied' : cls}</span>
                                      </button>
                                      {detail && (
                                        <button
                                          type="button"
                                          onClick={() => copy(detail)}
                                          className="mt-0.5 w-full text-left text-[11px] leading-5 text-zinc-600 hover:underline break-words"
                                        >
                                          {copied === detail ? 'Copied' : detail}
                                        </button>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );

          const idx = columnMap[cat.name as keyof typeof columnMap] ?? 2;
          columns[idx].push(card);
        });

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          className="px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white "
          onClick={() => setOpen(Object.fromEntries(allKeys(filtered).map(k => [k, true])))}
        >
          Expand all
        </button>
        <button
          type="button"
          className="px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white "
          onClick={() => setOpen({})}
        >
          Collapse all
        </button>
      </div>

      {/* Responsive 1/2/3 fixed columns with assigned categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-3">
            {col}
          </div>
        ))}
      </div>
    </div>
  );
}
