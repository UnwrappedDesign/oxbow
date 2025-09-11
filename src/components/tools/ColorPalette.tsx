import React, { useEffect, useMemo, useRef, useState } from 'react';

const families = [
  'slate','gray','zinc','neutral','stone',
  'red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose',
];
const shades = [50,100,200,300,400,500,600,700,800,900,950] as const;

function className(family: string, shade: number) {
  return `bg-${family}-${shade}`;
}

type Format = 'class' | 'hex' | 'rgb' | 'hsl' | 'oklch' | 'var';

export default function ColorPalette() {
  const [query, setQuery] = useState('');
  const [ setCopied] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [format, setFormat] = useState<Format>('class');
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

  function getComputedBg(cls: string): string | null {
    if (cacheRef.current[cls]) return cacheRef.current[cls];
    try {
      const el = document.createElement('div');
      el.className = `${cls}`;
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.top = '-9999px';
      el.style.width = '1px';
      el.style.height = '1px';
      document.body.appendChild(el);
      const color = getComputedStyle(el).backgroundColor || '';
      document.body.removeChild(el);
      cacheRef.current[cls] = color;
      return color;
    } catch {
      return null;
    }
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

  function formatValue(family: string, shade: number): string {
    const cls = className(family, shade);
    const varName = `--color-${family}-${shade}`;
    if (format === 'class') return `bg-${family}-${shade}`;
    if (format === 'var') return varName;
    const bg = getComputedBg(cls);
    const rgb = bg ? rgbFromCss(bg) : null;
    if (!rgb) return `bg-${family}-${shade}`;
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
    return `bg-${family}-${shade}`;
  }

  function formatValueFromEl(el: HTMLElement, family: string, shade: number): string {
    const cls = className(family, shade);
    if (format === 'class') return `bg-${family}-${shade}`;
    if (format === 'var') return `--color-${family}-${shade}`;
    const bg = getComputedStyle(el).backgroundColor || getComputedBg(cls);
    const rgb = bg ? rgbFromCss(bg) : null;
    if (!rgb) return `bg-${family}-${shade}`;
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
    return `bg-${family}-${shade}`;
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
      <div className="flex items-center gap-2 mb-4">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white text-zinc-700 h-[38px]"
            aria-haspopup="menu"
            aria-expanded={open}
            title="Change copy format"
          >
            <span className="text-zinc-500">Format:</span>
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
              className="absolute left-0 top-full z-50 mt-2 w-52 origin-top-left rounded-xl outline outline-zinc-100 shadow bg-white text-[13px] text-zinc-600 divide-y divide-zinc-100"
            >
              <div className="py-2">
                {(['class','hex','rgb','hsl','oklch','var'] as Format[]).map((opt) => (
                  <button
                    key={opt}
                    role="menuitem"
                    onClick={() => { setFormat(opt); setOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100"
                  >
                    <span className="font-mono">{opt}</span>
                    {format === opt && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-stone-600">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4-4a.75.75 0 011.06-1.06l3.353 3.353 7.528-9.884a.75.75 0 011.043-.136z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 text-xs text-zinc-500">
                Tip: clicking a swatch copies in this format.
              </div>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Filter colors (e.g., blue, gray)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white border rounded-md outline-none border-zinc-200 focus:border-zinc-300 h-[38px]"
        />
      </div>
      <div className="space-y-8">
        {list.map((family) => (
          <section key={family}>
            <div className="mb-2 text-sm font-medium capitalize text-zinc-700">{family}</div>
            <div className="color-grid">
              {shades.map((shade) => {
                const cls = className(family, shade);
                const label = `${family}-${shade}`;
                const key = label;
                return (
                  <div key={label} className="flex flex-col items-stretch">
                    <button
                      onClick={(e) => {
                        const value = formatValueFromEl(e.currentTarget as HTMLElement, family, shade);
                        copy(value, key);
                      }}
                      title={`Click to copy`}
                      className={`relative h-14 rounded-md ${cls}`}
                    >
                      {copiedKey === key && (
                        <span className="absolute inset-0 grid text-[11px] font-mono place-items-center rounded-md bg-black/40 text-white">Copied</span>
                      )}
                    </button>
                    <span className="mt-1 text-[11px] font-mono text-zinc-600">{shade}</span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <style jsx>{`
        .color-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.5rem;
        }
        @media (min-width: 640px) {
          .color-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 768px) {
          .color-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .color-grid {
            grid-template-columns: repeat(11, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
