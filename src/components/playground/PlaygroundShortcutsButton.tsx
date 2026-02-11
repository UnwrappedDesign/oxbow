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
        className="fixed z-50 flex items-center gap-1 p-2 text-white transition-colors rounded-lg shadow-normal bottom-2 right-6 bg-base-900 hover:bg-base-600 focus:outline-none dark:bg-base-900 dark:text-base-50 dark:hover:bg-base-700"
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
            className="relative w-full max-w-xl transition-colors  shadow-xl bg-base-100 divide-y divide-base-200 dark:bg-base-900 dark:divide-base-800 outline outline-base-300 dark:outline-base-700"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
          >
            <div className="p-8 lg:pt-20 relative">
              <button
                type="button"
                className="transition-colors text-base-400 hover:text-base-700 dark:text-base-400 dark:hover:text-base-200 absolute top-4 right-4 bg-white dark:bg-base-950 z-10 p-2 rounded-full"
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts modal"
              >
                <X size={14} />
              </button>
              <div
                aria-hidden="true"
                className="pointer-events-none bg-light-vertical-stripes dark:bg-base-vertical-stripes absolute inset-0 h-full w-[10%] ml-auto mr-[23%]"
              ></div>
             
              <div
                aria-hidden="true"
                className="pointer-events-none bg-blue-vertical-stripes dark:bg-blue-vertical-stripes-dark absolute inset-0 h-full w-[22%] ml-auto"
              ></div>
             
              <div className="relative">
                <h3
                  className="text-lg font-semibold font-display sm:text-xl md:text-2xl text-base-900 dark:text-white"
                  id="modal-title"
                >
                  Use shortcuts
                </h3>
                <p className="text-sm mt-2 text-base-600 dark:text-base-400 text-balance">
                  Navigate faster and code smarter with these keyboard shortcuts
                  to boost your productivity.
                </p>
              </div>
            </div>
          
            <ul className="p-8 space-y-2 text-xs text-base-600 dark:text-base-300">
              {[
                {
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
                },
              ].map(({ label, combo }) => (
                <li key={label} className="flex items-center justify-between gap-2">
                  <span>{label}</span>
                  <span
                    className="flex-1 block h-px mx-2 border-b border-base-300 dark:border-base-700"
                    aria-hidden="true"
                  ></span>
                  <div className="flex items-center gap-1">
                    {combo.map((key) => (
                      <kbd
                        key={key}
                        className="flex items-center justify-center  px-1 text-[0.65rem] font-mono font-medium uppercase text-base-700 dark:text-base-100 "
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
