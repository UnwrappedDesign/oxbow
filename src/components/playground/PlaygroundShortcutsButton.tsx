import React, { useState } from "react";
import { Command, X } from "lucide-react";

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
        aria-label="Show keyboard shortcuts"
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-2 right-2 z-50 bg-zinc-500 text-white rounded-full shadow-normal p-2.5 hover:bg-zinc-600 focus:outline-none"
      >
        <span className="sr-only">Show keyboard shortcuts</span>
        <Command size={16} />
      </button>
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 select-none"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-sand-100 rounded-lg shadow-xl divide-y divide-zinc-200  w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
          >
            <div className="flex items-center justify-between gap-2 px-8 py-4">
              <h2 className="text-2xl font-semibold italic font-serif  text-zinc-900 ">
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
            <ul className="space-y-1 text-xs text-zinc-600  p-8">
              <li className="flex items-end gap-1 justify-between ">
                <span >Dark mode</span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">D</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
               <span > Light mode</span>
               <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">L</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >System mode</span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">S</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >Copy code</span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">C</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >Open code tab</span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Shift</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">1</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >Open preview tab</span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Shift</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">2</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >Download code </span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Shift</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">D</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >Open in big screen </span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">O</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
               <span > Previous/Next page</span>
               <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
                <div className="flex items-center gap-1 ">
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">←</kbd>
                  
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 size-5 flex items-center justify-center">→</kbd>
                </div>
              </li>
              <li className="flex items-end gap-1 justify-between ">
                <span >Close navigation menus</span>
                <span className="flex-1 mx-2 block h-px border-b border-zinc-300" aria-hidden="true"></span>
               
                  <kbd className="text-[0.65rem] text-zinc-700 font-mono uppercase font-medium p-1 bg-sand-50 rounded outline outline-zinc-200 h-5 flex items-center justify-center">Esc</kbd>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
