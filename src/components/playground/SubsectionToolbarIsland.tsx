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
  const [pos, setPos] = useState<{top:number,left:number}>({top:0,left:0});
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
    const r = ev.currentTarget.getBoundingClientRect();
    setPos({ top: Math.min(r.bottom+8, window.innerHeight-10), left: Math.max(8,r.right-220) });
    setOpen(which);
  };
  return (
    <div className="items-center justify-end hidden md:flex gap-1">
      {/* Category */}
      <button onClick={(e)=>openMenu('cat', e)} className="inline-flex items-center gap-2 h-[28px] px-2 py-1 rounded-lg bg-white outline outline-1 outline-zinc-200 text-zinc-700 text-xs">
        <span className="capitalize">{fmt(cat)}</span>
        <ChevronDown className="size-4"/>
      </button>
      {open==='cat' && (
        <div ref={menuRef} className="fixed z-50 mt-2 w-56 rounded-xl outline outline-zinc-100 shadow bg-white text-[12px] text-zinc-600 divide-y divide-zinc-100" style={{top:pos.top,left:pos.left}}>
          <div className="py-2 max-h-64 overflow-auto">
            {Object.keys(subsByCat).sort().map(key => (
              <a key={key} href={`/playground/${key}/${(subsByCat[key]||[])[0]||''}`} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-sand-100">
                <span className="capitalize">{fmt(key)}</span>
                {cat===key && <Check className="size-4 text-blue-600"/>}
              </a>
            ))}
          </div>
        </div>
      )}
      {/* Subsection */}
      <button onClick={(e)=>openMenu('sub', e)} className="inline-flex items-center gap-2 h-[28px] px-2 py-1 rounded-lg bg-white outline outline-1 outline-zinc-200 text-zinc-700 text-xs">
        <span className="capitalize">{fmt(sub)}</span>
        <ChevronDown className="size-4"/>
      </button>
      {open==='sub' && (
        <div ref={menuRef} className="fixed z-50 mt-2 w-64 rounded-xl outline outline-zinc-100 shadow bg-white text-[12px] text-zinc-600 divide-y divide-zinc-100" style={{top:pos.top,left:pos.left}}>
          <div className="py-2 max-h-64 overflow-auto">
            {(subsByCat[cat]||[]).map(name => (
              <a key={name} href={`/playground/${cat}/${name}`} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-sand-100">
                <span className="capitalize">{fmt(name)}</span>
                {sub===name && <Check className="size-4 text-blue-600"/>}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
