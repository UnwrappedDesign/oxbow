import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type SubsByCat = Record<string, string[]>;

interface Props {
  cat: string;
  sub: string;
  subsByCat: SubsByCat;
}

export default function SubsectionToolbarIsland({ cat, sub, subsByCat }: Props){
  const [open, setOpen] = useState<'cat' | 'sub' | null>(null);
  const menuRef = useRef<HTMLDivElement|null>(null);
  const fmt = (s:string) => (s||'').replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
  const triggerClass = "inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-xs font-medium transition-colors hover:bg-muted bg-background text-muted-foreground hover:bg-background/80 hover:text-foreground focus:outline-none";
  const menuClass = "absolute z-50 top-full mt-2 right-0 rounded-lg shadow-md text-sm bg-background text-foreground";
  const menuItemClass = "w-full flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted hover:bg-background/70 text-xs";

  useEffect(()=>{
    const onEsc = (e:KeyboardEvent)=>{ if(e.key==='Escape') setOpen(null); };
    const onClick = (e:MouseEvent)=>{ const t = e.target as Node; if(menuRef.current?.contains(t)) return; setOpen(null); };
    window.addEventListener('keydown', onEsc); window.addEventListener('click', onClick);
    return ()=>{ window.removeEventListener('keydown', onEsc); window.removeEventListener('click', onClick); };
  },[]);

  const toggleMenu = (which: 'cat' | 'sub', ev: React.MouseEvent<HTMLButtonElement>)=>{
    ev.stopPropagation();
    setOpen((prev) => (prev === which ? null : which));
  };

  const renderMenu = (
    which: 'cat' | 'sub',
    widthClass: string,
    items: string[],
    hrefFor: (value: string) => string,
    isSelected: (value: string) => boolean
  ) => {
    if (open !== which) return null;
    return (
      <div ref={menuRef} className={`${menuClass} ${widthClass}`}>
        <div className="p-2 overflow-auto max-h-72">
          {items.map((value) => (
            <a
              key={value}
              href={hrefFor(value)}
              className={menuItemClass}
            >
              <span className="capitalize">{fmt(value)}</span>
              {isSelected(value) && <Check className="text-foreground size-4" />}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button onClick={(e) => toggleMenu('cat', e)} className={triggerClass}>
          <span className="capitalize">{fmt(cat)}</span>
          <ChevronDown className="size-3.5"/>
        </button>
        {renderMenu(
          'cat',
          'w-56',
          Object.keys(subsByCat).sort(),
          (value) => `/playground/${value}/${(subsByCat[value] || [])[0] || ''}`,
          (value) => cat === value
        )}
      </div>
      <div className="relative">
        <button onClick={(e) => toggleMenu('sub', e)} className={triggerClass}>
          <span className="capitalize">{fmt(sub)}</span>
          <ChevronDown className="size-3.5"/>
        </button>
        {renderMenu(
          'sub',
          'w-64',
          subsByCat[cat] || [],
          (value) => `/playground/${cat}/${value}`,
          (value) => sub === value
        )}
      </div>
    </div>
  );
}
