import React, { useMemo, useState } from 'react';

const families = [
  'slate','gray','zinc','neutral','stone',
  'red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose',
];
const shades = [50,100,200,300,400,500,600,700,800,900,950] as const;

function className(family: string, shade: number) {
  return `bg-${family}-${shade}`;
}

export default function ColorPalette() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string>('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return families;
    return families.filter((f) => f.includes(q));
  }, [query]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 1200);
    } catch {}
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Filter colors (e.g., blue, gray)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm text-base-900 placeholder:text-base-400 bg-white border rounded-md outline-none border-base-200 focus:border-base-300"
        />
      </div>
      <div className="space-y-8">
        {list.map((family) => (
          <section key={family}>
            <div className="mb-2 text-sm font-medium capitalize text-base-700">{family}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2">
              {shades.map((shade) => {
                const cls = className(family, shade);
                const label = `${family}-${shade}`;
                const toCopy = `bg-${label}`;
                return (
                  <button
                    key={label}
                    onClick={() => copy(toCopy)}
                    title={`Click to copy: ${toCopy}`}
                    className={`relative h-14 rounded-md  flex items-end justify-between p-2 text-[11px] font-mono ${cls} text-white/90`}
                  >
                    <span className="capitalize mix-blend-difference">{shade}</span>
                    {copied === toCopy && (
                      <span className="absolute inset-0 grid text-[11px] place-items-center rounded-md bg-black/40 text-white">Copied</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
