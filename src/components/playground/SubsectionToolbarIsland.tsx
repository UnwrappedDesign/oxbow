import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type SubsByCat = Record<string, string[]>;

interface Props {
  cat: string;
  sub: string;
  subsByCat: SubsByCat;
}

export default function SubsectionToolbarIsland({ cat, sub, subsByCat }: Props){
  const [open, setOpen] = useState<'cat'|'sub'|null>(null);
  const menuRef = useRef<HTMLDivElement|null>(null);
  const fmt = (s:string) => (s||'').replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
  useEffect(()=>{
    const onEsc = (e:KeyboardEvent)=>{ if(e.key==='Escape') setOpen(null); };
    const onClick = (e:MouseEvent)=>{ const t = e.target as Node; if(menuRef.current?.contains(t)) return; setOpen(null); };
    window.addEventListener('keydown', onEsc); window.addEventListener('click', onClick);
    return ()=>{ window.removeEventListener('keydown', onEsc); window.removeEventListener('click', onClick); };
  },[]);
  const openMenu = (which:'cat'|'sub', ev: React.MouseEvent<HTMLButtonElement>)=>{
    ev.stopPropagation();
    if (open===which){ setOpen(null); return; }
    setOpen(which);
  };
  return (
    <div className="flex items-center gap-4">
      {/* Category */}
      <div className="relative">
        <button onClick={(e)=>openMenu('cat', e)} className="flex items-center gap-1 text-xs font-medium transition-colors text-base-600 hover:text-base-900 dark:text-base-400 dark:hover:text-white">
          <span className="capitalize">{fmt(cat)}</span>
          <ChevronDown className="size-4"/>
        </button>
        {open==='cat' && (
          <div ref={menuRef} className="absolute z-50 top-full  mt-2 right-0 w-56 outline outline-base-200 shadow bg-white text-xs text-base-600 divide-y divide-base-100 dark:bg-base-950 dark:text-base-300 dark:outline-base-800 dark:divide-base-800">
            <div className="py-2 overflow-auto max-h-64">
              {Object.keys(subsByCat).sort().map(key => (
                <a key={key} href={`/playground/${key}/${(subsByCat[key]||[])[0]||''}`} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-base-100 dark:hover:bg-base-800/60">
                  <span className="capitalize">{fmt(key)}</span>
                  {cat===key && <Check className="text-base-950 dark:text-white size-4"/>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Subsection */}
      <div className="relative">
        <button onClick={(e)=>openMenu('sub', e)} className="flex items-center gap-1 text-xs font-medium transition-colors text-base-600 hover:text-base-900 dark:text-base-400 dark:hover:text-white">
          <span className="capitalize">{fmt(sub)}</span>
          <ChevronDown className="size-4"/>
        </button>
        {open==='sub' && (
          <div ref={menuRef} className="absolute z-50 top-full  mt-2 right-0 w-64 outline outline-base-200 shadow bg-white text-xs text-base-600 divide-y divide-base-100 dark:bg-base-950 dark:text-base-300 dark:outline-base-800 dark:divide-base-800">
            <div className="py-2 overflow-auto max-h-64">
              {(subsByCat[cat]||[]).map(name => (
                <a key={name} href={`/playground/${cat}/${name}`} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-base-100 dark:hover:bg-base-800/60">
                  <span className="capitalize">{fmt(name)}</span>
                  {sub===name && <Check className="text-base-950 dark:text-white size-4"/>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
