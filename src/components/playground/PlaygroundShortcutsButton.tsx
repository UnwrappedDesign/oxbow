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
        className="fixed z-50 flex items-center gap-1 p-2 text-white transition-colors rounded-lg shadow-normal bottom-2 right-6 bg-zinc-900 hover:bg-zinc-600 focus:outline-none dark:bg-base-900 dark:text-base-50 dark:hover:bg-base-700"
      >
        <span className="sr-only">Show keyboard shortcuts</span>
        <Keyboard size={18} />
      </button>
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/40 backdrop-blur-[2px]"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="relative w-full max-w-md transition-colors rounded-lg shadow-xl bg-base-100 divide-y divide-zinc-200 dark:bg-base-900 dark:divide-base-800"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
          >
            <div className="flex items-center justify-between px-8 py-4 gap-2">
              <h2 className="font-serif text-2xl italic font-semibold text-zinc-900 dark:text-base-50">
                Keyboard Shortcuts
              </h2>
              <button
                type="button"
                className="transition-colors text-zinc-400 hover:text-zinc-700 dark:text-base-400 dark:hover:text-base-200"
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts modal"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="p-8 space-y-2 text-xs text-zinc-600 dark:text-base-300">
              {[{
                label: "Dark mode",
                combo: ["Ctrl", "1"],
              },
              {
                label: "Light mode",
                combo: ["Ctrl", "2"],
              },
              {
                label: "System mode",
                combo: ["Ctrl", "3"],
              },
              {
                label: "Copy code (if open)",
                combo: ["Cmd", "C"],
              },
              {
                label: "Open code tab",
                combo: ["Cmd", "Shift", "1"],
              },
              {
                label: "Open preview tab",
                combo: ["Cmd", "Shift", "2"],
              },
              {
                label: "Download code",
                combo: ["Cmd", "Shift", "D"],
              },
              {
                label: "Open in big screen",
                combo: ["Cmd", "O"],
              },
              {
                label: "Previous/Next page",
                combo: ["←", "→"],
              },
              {
                label: "Close navigation menus",
                combo: ["Esc"],
              }].map(({ label, combo }) => (
                <li key={label} className="flex items-end justify-between gap-1">
                  <span>{label}</span>
                  <span
                    className="flex-1 block h-px mx-2 border-b border-zinc-300 dark:border-base-700"
                    aria-hidden="true"
                  ></span>
                  <div className="flex items-center gap-1">
                    {combo.map((key) => (
                      <kbd
                        key={key}
                        className="flex items-center justify-center h-5 px-1 text-[0.65rem] font-mono font-medium uppercase rounded outline outline-1 outline-zinc-200 bg-base-50 text-zinc-700 dark:bg-base-800 dark:text-base-100 dark:outline-base-700"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
