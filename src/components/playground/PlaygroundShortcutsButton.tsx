import React, { useState } from "react";
import { Keyboard, X } from "lucide-react";

export default function PlaygroundShortcutsButton() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  React.useEffect(() => {
    if (!showShortcuts) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowShortcuts(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showShortcuts]);

  return (
    <>
      <button
        type="button"
        title="Keyboard Shortcuts"
        onClick={() => setShowShortcuts(true)}
        className="fixed z-50 flex items-center p-2 text-white rounded-lg bottom-2 right-6 bg-zinc-900 shadow-normal hover:bg-zinc-600 focus:outline-none gap-1"
      >
        <span className="sr-only">Show keyboard shortcuts</span>
        <Keyboard size={18} />
      </button>
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/40"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="relative w-full max-w-md rounded-lg shadow-xl bg-sand-100 divide-y divide-zinc-200 "
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
          >
            <div className="flex items-center justify-between px-8 py-4 gap-2">
              <h2 className="font-serif text-2xl italic font-semibold  text-zinc-900">
                Keyboard Shortcuts
              </h2>
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-700 "
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts modal"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="p-8 text-xs space-y-2 text-zinc-600 ">
              <li className="flex items-end justify-between gap-1 ">
                <span >Dark mode</span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Ctrl</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">1</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
               <span > Light mode</span>
               <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Ctrl</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">2</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >System mode</span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Ctrl</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">3</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >Copy code ( if open )</span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">C</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >Open code tab </span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Shift</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">1</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >Open preview tab</span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Shift</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">2</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >Download code </span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Shift</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">D</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >Open in big screen </span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">O</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
               <span > Previous/Next page</span>
               <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">←</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">→</kbd>
                </div>
              </li>
              <li className="flex items-end justify-between gap-1 ">
                <span >Close navigation menus</span>
                <span className="flex-1 block h-px mx-2 border-b border-zinc-300" aria-hidden="true"></span>
               
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Esc</kbd>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
