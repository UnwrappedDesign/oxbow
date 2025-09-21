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
              <h2 className="text-2xl font-semibold italic font-serif  text-zinc-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts modal"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200 p-8">
              <li className="flex items-center gap-2 justify-between">
                <span className="text-zinc-600">Dark mode</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 size-5 flex items-center justify-center">D</kbd>
                </div>
              </li>
              <li className="flex items-center gap-2 justify-between">
               <span className="text-zinc-600"> Light mode</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 size-5 flex items-center justify-center">L</kbd>
                </div>
              </li>
              <li className="flex items-center gap-2 justify-between">
                <span className="text-zinc-600">System mode</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 size-5 flex items-center justify-center">S</kbd>
                </div>
              </li>
              <li className="flex items-center gap-2 justify-between">
                <span className="text-zinc-600">Copy code</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 h-5 flex items-center justify-center">Cmd</kbd>
                  
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 size-5 flex items-center justify-center">C</kbd>
                </div>
              </li>
              <li className="flex items-center gap-2 justify-between">
               <span className="text-zinc-600"> Previous/Next page</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 size-5 flex items-center justify-center">←</kbd>
                  
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 size-5 flex items-center justify-center">→</kbd>
                </div>
              </li>
              <li className="flex items-center gap-2 justify-between">
                <span className="text-zinc-600">Close navigation menus</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <kbd className="text-xs text-zinc-900 font-mono uppercase font-semibold p-1 bg-white rounded border border-zinc-200 h-5 flex items-center justify-center">Esc</kbd>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
