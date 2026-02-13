import React from "react";

type SubsByCat = Record<string, string[]>;

interface Props {
  cat: string;
  sub: string;
  subsByCat: SubsByCat;
}

export default function SubsectionToolbarIsland({ cat, sub, subsByCat }: Props){
  void subsByCat;
  const fmt = (s: string) =>
    (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const pillClass =
    "inline-flex h-8 items-center rounded-md bg-muted px-2.5 text-xs text-foreground whitespace-nowrap";

  return (
    <div className="flex items-center gap-2">
      <div className={pillClass}>
        <span className="capitalize">{fmt(cat)}</span>
      </div>
      <div className={pillClass}>
        <span className="capitalize">{fmt(sub)}</span>
      </div>
    </div>
  );
}
