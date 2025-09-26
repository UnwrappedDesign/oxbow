import React, {useEffect, useMemo, useRef, useState} from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

type SubsByCat = Record<string, string[]>;
type Counts = Record<string, number>;

interface Props {
  cat: string;
  sub: string;
  idx: number;
  subsByCat: SubsByCat;
  counts: Counts;
  prevHref?: string;
  nextHref?: string;
  sectionLength: number;
}

export default function DetailToolbarIsland({ cat, sub, idx, subsByCat, counts, prevHref, nextHref }: Props){
  const [open, setOpen] = useState<'cat'|'sub'|'idx'|null>(null);
  const btnRef = useRef<HTMLButtonElement|null>(null);
  const menuRef = useRef<HTMLDivElement|null>(null);
  const [menuPos, setMenuPos] = useState<{top:number,left:number,width:number}>({top:0,left:0,width:0});

  const fmt = (s:string) => (s||'').replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
  const count = (c:string, s:string) => counts[`${c}/${s}`] || 1;
  const clamp = (n:number,min:number,max:number) => Math.max(min, Math.min(max, n));

  useEffect(()=>{
    const onEsc = (e:KeyboardEvent)=>{ if(e.key==='Escape') setOpen(null); };
    const onClick = (e:MouseEvent)=>{
      if (!menuRef.current && !btnRef.current) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(null);
    };
    window.addEventListener('keydown', onEsc);
    window.addEventListener('click', onClick);
    return ()=>{ window.removeEventListener('keydown', onEsc); window.removeEventListener('click', onClick); };
  },[]);

  const openMenu = (which:'cat'|'sub'|'idx', ev: React.MouseEvent<HTMLButtonElement>)=>{
    ev.stopPropagation();
    if (open===which){ setOpen(null); return; }
    const r = (ev.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const top = r.bottom + 8;
    const left = r.right - 220; // right aligned, menu width ~220
    setMenuPos({ top: Math.min(top, window.innerHeight-10), left: Math.max(8,left), width:r.width });
    setOpen(which);
  };

  const go = (href:string) => { window.location.assign(href); };

  const CatMenu = () => (
    <div ref={menuRef} className="fixed z-50 w-56 mt-2 text-xs bg-white shadow rounded-xl outline outline-zinc-100 text-zinc-600 divide-y divide-zinc-100" style={{top:menuPos.top, left:menuPos.left}}>
      <div className="py-2 overflow-auto max-h-64">
        {Object.keys(subsByCat).sort().map(key => (
          <button key={key} onClick={()=>{ const first = (subsByCat[key]||[])[0]||''; go(`/playground/${key}/${first}/${clamp(idx,1,count(key,first))}`); }} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-sand-100 text-left text-xs">
            <span className="capitalize">{fmt(key)}</span>
            {cat===key && <Check className="size-4 text-accent-600"/>}
          </button>
        ))}
      </div>
    </div>
  );

  const SubMenu = () => (
    <div ref={menuRef} className="fixed z-50 w-64 mt-2 text-xs bg-white shadow rounded-xl outline outline-zinc-100 text-zinc-600 divide-y divide-zinc-100" style={{top:menuPos.top, left:menuPos.left}}>
      <div className="py-2 overflow-auto max-h-64">
        {(subsByCat[cat]||[]).map(name => (
          <a key={name} href={`/playground/${cat}/${name}/${clamp(idx,1,count(cat,name))}`} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-sand-100 text-xs">
            <span className="capitalize">{fmt(name)}</span>
            {sub===name && <Check className="size-4 text-accent-600"/>}
          </a>
        ))}
      </div>
    </div>
  );

  const IdxMenu = () => (
    <div ref={menuRef} className="fixed z-50 w-40 mt-2 text-xs bg-white shadow rounded-xl outline outline-zinc-100 text-zinc-600" style={{top:menuPos.top, left:menuPos.left}}>
      <div className="px-2 py-2 overflow-auto max-h-64 grid grid-cols-4 gap-1">
        {Array.from({length: count(cat, sub)}, (_,i)=> i+1).map(n => (
          <a key={n} href={`/playground/${cat}/${sub}/${n}`} className={`flex items-center justify-center px-2 py-1.5 rounded hover:bg-sand-100 text-xs ${n===clamp(idx,1,count(cat,sub))?'text-accent-600 font-medium':''}`}>{n}</a>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {/* Category */}
      <button ref={btnRef} onClick={(e)=>openMenu('cat', e)} className="inline-flex items-center gap-2 h-[28px] px-2 py-1 rounded-lg bg-white outline outline-1 outline-zinc-200 text-zinc-700 text-xs">
        <span className="capitalize">{fmt(cat)}</span>
        <ChevronDown className="size-4"/>
      </button>
      {open==='cat' && <CatMenu/>}

      {/* Block */}
      <button onClick={(e)=>openMenu('sub', e)} className="hidden md:inline-flex items-center gap-2 h-[28px] px-2 py-1 rounded-lg bg-white outline outline-1 outline-zinc-200 text-zinc-700 text-xs">
        <span className="capitalize">{fmt(sub)}</span>
        <ChevronDown className="size-4"/>
      </button>
      {open==='sub' && <SubMenu/>}

      {/* Number */}
      <button onClick={(e)=>openMenu('idx', e)} className="hidden md:inline-flex items-center  h-[28px] px-2 py-1 rounded-lg bg-white outline outline-1 outline-zinc-200 text-zinc-700 text-xs">
        <span>#0</span>
        <span>{clamp(idx,1,count(cat,sub))}</span>
        <ChevronDown className="size-4"/>
      </button>
      {open==='idx' && <IdxMenu/>}

      {/* Divider */}
      <div aria-hidden className="mx-1 h-4 w-[1px] bg-zinc-200 hidden md:inline-block"/>

      {/* Pagination */}
      <nav className="relative z-0 inline-flex gap-1.5" aria-label="Pagination">
        {prevHref ? (
          <a href={prevHref} aria-label="Go to previous page" className="inline-flex items-center justify-center h-7 w-7 rounded-md outline outline-1 outline-zinc-200"><ChevronLeft className="size-4"/></a>
        ) : (
          <div className="inline-flex items-center justify-center opacity-50 h-7 w-7 rounded-md outline outline-1 outline-zinc-100"><ChevronLeft className="size-4"/></div>
        )}
        {nextHref ? (
          <a href={nextHref} aria-label="Go to next page" className="inline-flex items-center justify-center h-7 w-7 rounded-md outline outline-1 outline-zinc-200"><ChevronRight className="size-4"/></a>
        ) : (
          <div className="inline-flex items-center justify-center opacity-50 h-7 w-7 rounded-md outline outline-1 outline-zinc-100"><ChevronRight className="size-4"/></div>
        )}
      </nav>
    </div>
  );
}
