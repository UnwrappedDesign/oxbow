import React, { useEffect, useMemo, useRef, useState } from 'react';
import colors from 'tailwindcss/colors';

// Tailwind default palette families we want to expose
const families = [
  'slate','gray','zinc','neutral','stone','red','orange','amber','yellow',
  'lime','green','emerald','teal','cyan','sky','blue','indigo','violet',
  'purple','fuchsia','pink','rose',
];
const shades = [50,100,200,300,400,500,600,700,800,900,950] as const;
const palette = colors as Record<string, Record<string, string>>;

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '').trim();
  const normalized = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (normalized.length !== 6) return null;
  const int = parseInt(normalized, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function getColor(family: string, shade: number): string | null {
  const col = palette[family];
  const value = col ? col[shade as unknown as keyof typeof col] : undefined;
  return typeof value === 'string' ? value : null;
}

type Format = 'var' | 'hex' | 'rgb' | 'hsl' | 'oklch';

export default function ColorPalette() {
  const [query, setQuery] = useState('');
  const [, setCopied] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [format, setFormat] = useState<Format>('oklch');
  const [open, setOpen] = useState(false);
  const cacheRef = useRef<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return families;
    return families.filter((f) => f.includes(q));
  }, [query]);

  async function copy(text: string, key?: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      if (key) setCopiedKey(key);
      setTimeout(() => setCopied(''), 1200);
    } catch {}
  }

  function rgbFromCss(color: string): [number, number, number] | null {
    if (!color) return null;
    const s = color.trim().toLowerCase();
    // rgb/rgba with commas: rgb(255, 255, 255)
    let m = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
    if (m) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])].map((n) => Math.round(n)) as [number, number, number];
    // rgb/rgba space-separated (CSS Color 4): rgb(255 255 255 / 1)
    m = s.match(/rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    if (m) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])].map((n) => Math.round(n)) as [number, number, number];
    // oklch(L C H [ / A])
    const o = s.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?/);
    if (o) {
      const Lraw = o[1];
      const L = Lraw.endsWith('%') ? parseFloat(Lraw) / 100 : parseFloat(Lraw);
      const C = parseFloat(o[2]);
      const H = parseFloat(o[3]);
      return oklchToRgb([L, C, H]);
    }
    return null;
  }

  // OKLCH -> sRGB utilities
  function linearToSrgb(u: number) {
    return u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
  }
  function oklabToLinear(l: number, a: number, b: number) {
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;
    const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const b2 = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
    return { r, g, b: b2 };
  }
  function oklchToRgb([L, C, H]: [number, number, number]): [number, number, number] {
    const hr = (H * Math.PI) / 180;
    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);
    const { r, g, b: bb } = oklabToLinear(L, a, b);
    const R = Math.max(0, Math.min(1, linearToSrgb(r)));
    const G = Math.max(0, Math.min(1, linearToSrgb(g)));
    const B = Math.max(0, Math.min(1, linearToSrgb(bb)));
    return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
  }

  function toHex([r, g, b]: [number, number, number]) {
    const h = (n: number) => n.toString(16).padStart(2, '0');
    return `#${h(r)}${h(g)}${h(b)}`;
  }

  function toHsl([r, g, b]: [number, number, number]): [number, number, number] {
    // Convert RGB 0-255 to 0-1
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  // sRGB -> OKLab -> OKLCH utilities
  function srgbToLinear(u: number) {
    u /= 255;
    return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
  }
  function linearToOklab(r: number, g: number, b: number) {
    // Convert linear sRGB to XYZ (D65) then to OKLab
    const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
    return { L, a, b: b2 };
  }
  function toOKLCH([r, g, b]: [number, number, number]): [number, number, number] {
    const { L, a, b: bb } = linearToOklab(r, g, b);
    const C = Math.sqrt(a * a + bb * bb);
    let H = Math.atan2(bb, a) * (180 / Math.PI);
    if (H < 0) H += 360;
    return [+(L).toFixed(2), +C.toFixed(2), +H.toFixed(0)];
  }

  function formatValue(color: string): string {
    if (format === 'var') return color;
    const cached = cacheRef.current[color];
    let rgb = cached ? rgbFromCss(cached) : null;
    if (!rgb) {
      rgb = rgbFromCss(color) || hexToRgb(color);
      if (rgb) cacheRef.current[color] = color;
    }
    if (!rgb) return color;
    if (format === 'hex') return toHex(rgb).toLowerCase();
    if (format === 'rgb') return `${rgb[0]} ${rgb[1]} ${rgb[2]}`;
    if (format === 'hsl') {
      const [h, s, l] = toHsl(rgb);
      return `${h} ${s}% ${l}%`;
    }
    if (format === 'oklch') {
      const [L, C, H] = toOKLCH(rgb);
      return `oklch(${L} ${C} ${H})`;
    }
    return variable;
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white text-zinc-700 h-[38px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            aria-haspopup="menu"
            aria-expanded={open}
            title="Change copy format"
          >
            <span className="text-zinc-500 dark:text-zinc-400">Format:</span>
            <span className="font-mono">{format}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 9l6 6l6 -6" />
            </svg>
          </button>
          {open && (
            <div
              role="menu"
              className="absolute left-0 top-full z-50 mt-2 w-52 origin-top-left rounded-xl outline outline-zinc-100 shadow bg-white text-[13px] text-zinc-600 divide-y divide-zinc-100 dark:outline-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:divide-zinc-800 dark:shadow-lg"
            >
              <div className="py-2">
                {(['var','hex','rgb','hsl','oklch'] as Format[]).map((opt) => (
                  <button
                    key={opt}
                    role="menuitem"
                    onClick={() => { setFormat(opt); setOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span className="font-mono">{opt}</span>
                    {format === opt && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-blue-600 size-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4-4a.75.75 0 011.06-1.06l3.353 3.353 7.528-9.884a.75.75 0 011.043-.136z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                Tip: clicking a swatch copies in this format.
              </div>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Filter colors (e.g., charcoal, sky)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white border rounded-md outline-none border-zinc-200 focus:border-zinc-300 h-[38px] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-600"
        />
      </div>
      <div className="space-y-8">
        {list.map((family) => (
          <section key={family}>
            <div className="mb-2 text-sm font-medium capitalize text-zinc-700 dark:text-zinc-200">{family}</div>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-11">
              {shades.map((shade) => {
                const color = getColor(family, shade);
                if (!color) return null;
                const label = `${family}-${shade}`;
                const key = label;
                return (
                  <div key={label} className="flex flex-col items-stretch">
                    <button
                      onClick={(e) => {
                        const value = formatValue(color);
                        copy(value, key);
                      }}
                      title={`Click to copy ${color}`}
                      className="relative h-14 rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-zinc-900"
                      style={{ backgroundColor: color }}
                    >
                      {copiedKey === key && (
                        <span className="absolute inset-0 grid text-[0.70rem] font-mono place-items-center rounded-md bg-black/40 text-white">Copied</span>
                      )}
                    </button>
                    <span className="mt-1 text-[0.70rem] font-mono text-zinc-600 dark:text-zinc-400">{shade}</span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
