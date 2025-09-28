import React, { useEffect, useMemo, useRef, useState } from "react";
import PlaygroundShortcutsButton from "./PlaygroundShortcutsButton";
import {
  Eye,
  Code,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  Sun,
  Moon,
  Laptop,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,

} from "lucide-react";
type Mode = "light" | "system" | "dark";
type Tab = "preview" | "code";
interface Props {
  iframeId: string;
  iframeSrc: string;
  canSeeCode: boolean;
  initialTab: Tab;
  ppcode: string;
  ppcodeLight?: string;
  ppcodeDarkOnly?: string;
  highlightedSystem?: string;
  highlightedLight?: string;
  highlightedDark?: string;
  hostId?: string;
  // Optional nav controls (detail page)
  navCat?: string;
  navSub?: string;
  navIdx?: number;
  subsByCat?: Record<string, string[]>;
  counts?: Record<string, number>;
  prevHref?: string;
  nextHref?: string;
  sectionLength?: number;
  blockPath?: string;
}
export default function PlaygroundIsland({
  iframeId,
  iframeSrc,
  canSeeCode,
  initialTab,
  ppcode,
  ppcodeLight,
  ppcodeDarkOnly,
  blockPath: _blockPath,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Persist mode in localStorage
  const [mode, setModeState] = useState<Mode>("system");
  // Always sync mode from localStorage on mount (and when remounting after navigation)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("oxbow-playground-mode");
      if (saved === "light" || saved === "dark" || saved === "system")
        setModeState(saved);
    }
  }, []);
  const setMode = (m: Mode) => {
    setModeState(m);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("oxbow-playground-mode", m);
    }
  };
  const [tab, setTab] = useState<Tab>(initialTab || "preview");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );
  const [navOpen, setNavOpen] = useState<null | "cat" | "sub" | "idx">(null);
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const [navPos, setNavPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  // Choose the text version of the code to display (escaped in <pre><code>)
  const codeText = useMemo(() => {
    if (mode === "light") return ppcodeLight || ppcode;
    if (mode === "dark") return ppcodeDarkOnly || ppcode;
    return ppcode;
  }, [mode, ppcode, ppcodeLight, ppcodeDarkOnly]);
  const applyModeToIframe = (m: Mode) => {
    const ifr = iframeRef.current;
    const doc = ifr?.contentDocument || ifr?.contentWindow?.document;
    const html = doc?.documentElement;
    const body = doc?.body || undefined;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const enableDark = m === "dark" || (m === "system" && prefersDark);
    if (html) {
      html.classList.toggle("dark", enableDark);
      if (body) body.classList.toggle("dark", enableDark);
      if (enableDark) {
        html.setAttribute("data-theme", "dark");
        if (body) body.setAttribute("data-theme", "dark");
      } else {
        html.removeAttribute("data-theme");
        if (body) body.removeAttribute("data-theme");
      }
    }
    try {
      ifr?.contentWindow?.postMessage(
        { type: "oxbow-set-dark", enable: enableDark },
        "*",
      );
      // Recompute height after theme changes
      setTimeout(
        () =>
          ifr?.contentWindow?.postMessage(
            { type: "oxbow-request-height" },
            "*",
          ),
        20,
      );
      setTimeout(
        () =>
          ifr?.contentWindow?.postMessage(
            { type: "oxbow-request-height" },
            "*",
          ),
        120,
      );
    } catch {}
  };
  const requestHeight = () => {
    const ifr = iframeRef.current;
    try {
      ifr?.contentWindow?.postMessage({ type: "oxbow-request-height" }, "*");
    } catch {}
  };
  useEffect(() => {
    // Apply mode on change
    applyModeToIframe(mode);
  }, [mode]);
  useEffect(() => {
    // On mount or when iframeSrc changes, request height and apply mode
    const t1 = setTimeout(requestHeight, 50);
    const t2 = setTimeout(requestHeight, 200);
    applyModeToIframe(mode);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [iframeSrc, mode]);
  // Close nav menus on Escape / outside
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(null);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (navMenuRef.current?.contains(t)) return;
      setNavOpen(null);
    };
    const onArrow = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === "INPUT" || tgt.isContentEditable)) return;
      if (e.key === "ArrowLeft" && arguments[0]?.prevHref) {
        window.location.assign(arguments[0].prevHref);
      } else if (e.key === "ArrowRight" && arguments[0]?.nextHref) {
        window.location.assign(arguments[0].nextHref);
      }
    };
    const onThemeShortcuts = (e: KeyboardEvent) => {
      // Theme switching with Ctrl + number (use code for reliability)
      if (e.ctrlKey && !e.metaKey && !e.altKey) {
        const code = e.code;
        if (code === "Digit1") {
          setMode("dark");
          e.preventDefault();
        } else if (code === "Digit2") {
          setMode("light");
          e.preventDefault();
        } else if (code === "Digit3") {
          setMode("system");
          e.preventDefault();
        }
      }
      // Tab switching: Cmd + Shift + 1/2 (use code, since Shift+1 => "!")
      if (e.metaKey && e.shiftKey && !e.altKey && !e.ctrlKey) {
        const code = e.code;
        if (code === "Digit1") {
          setTab("code");
          e.preventDefault();
        } else if (code === "Digit2") {
          setTab("preview");
          e.preventDefault();
        }
      }
      // Download code: Cmd + Shift + D
      if (canSeeCode && tab === "code" && e.metaKey && e.shiftKey && !e.altKey && !e.ctrlKey && e.key.toLowerCase() === "d") {
        downloadCode();
        e.preventDefault();
      }
      // Open in new window: Cmd + O
      if (canSeeCode && e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey && e.key.toLowerCase() === "o") {
        openInNewWindow();
        e.preventDefault();
      }
      // Copy code: Cmd + C
      if (canSeeCode && tab === "code" && e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey && e.key.toLowerCase() === "c") {
        copyCode();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onEsc);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onArrow);
    window.addEventListener("keydown", onThemeShortcuts);
    return () => {
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onArrow);
      window.removeEventListener("keydown", onThemeShortcuts);
    };
  }, [canSeeCode, tab]);
  useEffect(() => {
    // Re-request height when returning to preview tab
    if (tab === "preview") {
      const t = setTimeout(requestHeight, 50);
      return () => clearTimeout(t);
    }
  }, [tab]);
  useEffect(() => {
    // In system mode, keep in sync with OS
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyModeToIframe("system");
    try {
      mq.addEventListener("change", listener);
    } catch {
      mq.addListener(listener);
    }
    return () => {
      try {
        mq.removeEventListener("change", listener);
      } catch {
        mq.removeListener(listener);
      }
    };
  }, [mode]);
  const copyCode = async () => {
    const text = codeText || "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1200);
  };
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.origin +
          window.location.pathname +
          `#${iframeId.replace("iframe-", "")}`,
      );
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 1200);
    } catch {}
  };
  const downloadCode = () => {
    try {
      const text = codeText || "";
      const blob = new Blob([text], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = (iframeSrc.split("/").pop() || "component")
        .replace(/\?.*$/, "")
        .replace(/[^a-z0-9-_.]/gi, "_");
      a.download = name || "component.html";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 100);
    } catch {}
  };
  const setViewportWidth = (v: "mobile" | "tablet" | "desktop") => {
    setViewport(v);
    const el = containerRef.current;
    if (!el) return;
    if (v === "mobile") el.style.width = "375px";
    else if (v === "tablet") el.style.width = "768px";
    else el.style.width = "100%";
    setTimeout(requestHeight, 260);
  };
  const fmt = (s: string) =>
    (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const count = (c: string, s: string) =>
    (arguments[0]?.counts || {})[`${c}/${s}`] || 1;
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const openInNewWindow = () => {
    try {
      const url = new URL(iframeSrc, window.location.origin);
      url.searchParams.set("mode", mode);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {}
  };
  const openNavMenu = (
    which: "cat" | "sub" | "idx",
    ev: React.MouseEvent<HTMLButtonElement>,
  ) => {
    ev.stopPropagation(); // Only stop propagation for nav menu buttons
    if (navOpen === which) {
      setNavOpen(null);
      return;
    }
    const r = ev.currentTarget.getBoundingClientRect();
    setNavPos({
      top: Math.min(r.bottom + 8, window.innerHeight - 10),
      left: Math.max(8, r.right - 220),
    });
    setNavOpen(which);
  };
  return (
    <div className="relative">
  <div className="flex items-center justify-between gap-1 pb-2 ">
        {/* Left: index + tools */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copyUrl}
            className={`inline-flex items-center justify-center size-7 px-2 text-xs transition-colors rounded-md bg-zinc-50 outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${copiedUrl ? "text-accent-500 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            title="Copy block URL"
            aria-label="Copy block URL"
          >
            {copiedUrl ? <Check size={14} /> : iframeId.replace("iframe-", "")}
          </button>
          <div
            aria-hidden
            className="hidden h-4 w-[1px] bg-zinc-200 md:inline-block dark:bg-base-700"
          />
          <span className="items-center hidden gap-1 isolate md:inline-flex">
            <button
              onClick={() => setViewportWidth("mobile")}
              className={`inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${viewport === "mobile" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            >
              <Smartphone size={14} />
            </button>
            <button
              onClick={() => setViewportWidth("tablet")}
              className={`inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${viewport === "tablet" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setViewportWidth("desktop")}
              className={`inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${viewport === "desktop" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            >
              <Monitor size={14} />
            </button>
          </span>
          <div
            aria-hidden
            className="hidden h-4 w-[1px] bg-zinc-200 md:inline-block dark:bg-base-700"
          />
          <span className="items-center hidden gap-1 isolate md:inline-flex">
            <button
              onClick={() => setMode("light")}
              className={`inline-flex items-center gap-1 h-7 px-2 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${mode === "light" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            >
              <Sun size={14} /> <span className="text-[0.70rem]">Light</span>
            </button>
            <button
              onClick={() => setMode("system")}
              className={`inline-flex items-center gap-1 h-7 px-2 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${mode === "system" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            >
              <Laptop size={14} /> <span className="text-[0.70rem]">System</span>
            </button>
            <button
              onClick={() => setMode("dark")}
              className={`inline-flex items-center gap-1 h-7 px-2 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${mode === "dark" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
            >
              <Moon size={14} /> <span className="text-[0.70rem]">Dark</span>
            </button>
          </span>
          {/* Code controls next to theme toggles */}
          <div
            aria-hidden
            className="hidden h-4 w-[1px] bg-zinc-200 md:inline-block dark:bg-base-700"
          />
          {canSeeCode ? (
            <div className="items-center hidden gap-1 md:inline-flex">
              <button
                onClick={() => setTab("preview")}
                className={`inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${tab === "preview" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => setTab("code")}
                className={`inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 dark:bg-base-900/60 dark:outline-base-700 ${tab === "code" ? "text-accent-600 dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
              >
                <Code size={14} />
              </button>
              <button
                onClick={copyCode}
                className="inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 text-zinc-600 hover:text-accent-600 dark:bg-base-900/60 dark:outline-base-700 dark:text-base-200 dark:hover:text-accent-400"
                title="Copy"
                aria-label="Copy"
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <div
                aria-hidden
                className="hidden h-4 w-[1px] bg-zinc-200 md:inline-block dark:bg-base-700"
              />
              <button
                onClick={downloadCode}
                className="inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 text-zinc-600 hover:text-accent-600 dark:bg-base-900/60 dark:outline-base-700 dark:text-base-200 dark:hover:text-accent-400"
                title="Download code"
                aria-label="Download code"
              >
                <Download size={14} />
              </button>
              <button
                onClick={openInNewWindow}
                className="inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 text-zinc-600 hover:text-accent-600 dark:bg-base-900/60 dark:outline-base-700 dark:text-base-200 dark:hover:text-accent-400"
                title="Open in new window"
                aria-label="Open in new window"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          ) : (
            <a
              href="/pricing"
              className="hidden md:inline-flex items-center h-7 px-2 text-[0.70rem] rounded-md bg-zinc-900 text-white dark:bg-accent-500 dark:text-base-900"
            >
              Get Access
            </a>
          )}
        </div>
        {/* Right: code controls + nav (if provided) */}
        <div className="items-center justify-end hidden gap-2 md:flex">
          {arguments[0]?.subsByCat && (
            <>
              {/* Category */}
              <button
                onClick={(e) => openNavMenu("cat", e)}
                className="inline-flex items-center gap-2 h-[28px] px-2 py-1 text-[0.70rem] transition-colors rounded-lg outline outline-1 outline-zinc-200 text-zinc-700 dark:bg-base-900/60 dark:text-base-200 dark:outline-base-700"
              >
                <span className="capitalize">
                  {fmt(arguments[0]!.navCat || "")}
                </span>
                <ChevronDown className="size-4" />
              </button>
              {/* Block */}
              <button
                onClick={(e) => openNavMenu("sub", e)}
                className="hidden md:inline-flex items-center gap-2 h-[28px] px-2 py-1 text-[0.70rem] transition-colors rounded-lg outline outline-1 outline-zinc-200 text-zinc-700 dark:bg-base-900/60 dark:text-base-200 dark:outline-base-700"
              >
                <span className="capitalize">
                  {fmt(arguments[0]!.navSub || "")}
                </span>
                <ChevronDown className="size-4" />
              </button>
              {/* Number */}
              <button
                onClick={(e) => openNavMenu("idx", e)}
                className="hidden md:inline-flex items-center h-[28px] px-2 py-1 text-[0.70rem] transition-colors rounded-lg outline outline-1 outline-zinc-200 text-zinc-700 dark:bg-base-900/60 dark:text-base-200 dark:outline-base-700"
              >
                <span>NO</span>
                
                <span>
                  {clamp(
                    arguments[0]!.navIdx || 1,
                    1,
                    count(
                      arguments[0]!.navCat || "",
                      arguments[0]!.navSub || "",
                    ),
                  )}
                </span>
                <ChevronDown className="size-4" />
              </button>
              {navOpen === "cat" && (
                <div
                  ref={navMenuRef}
                  className="fixed z-50 w-56 mt-2 text-xs transition-colors bg-white shadow rounded-xl outline outline-zinc-100 text-zinc-600 divide-y divide-zinc-100 dark:bg-base-900 dark:text-base-300 dark:outline-base-700 dark:divide-base-800"
                  style={{ top: navPos.top, left: navPos.left }}
                >
                  <div className="py-2 overflow-hidden max-h-64">
                    {Object.keys(arguments[0]!.subsByCat!)
                      .sort()
                      .map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            const first =
                              (arguments[0]!.subsByCat![key] || [])[0] || "";
                            window.location.assign(
                              `/playground/${key}/${first}/${clamp(arguments[0]!.navIdx || 1, 1, count(key, first))}`,
                            );
                          }}
                          className="flex items-center justify-between w-full px-3 py-1.5 text-left transition-colors text-xs hover:bg-base-100 dark:hover:bg-base-800/60"
                        >
                          <span className="capitalize">{fmt(key)}</span>
                          {arguments[0]!.navCat === key && (
                            <Check className="size-4 text-accent-600 dark:text-accent-400" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {navOpen === "sub" && (
                <div
                  ref={navMenuRef}
                  className="fixed z-50 w-64 mt-2 text-xs transition-colors bg-white shadow rounded-xl outline outline-zinc-100 text-zinc-600 divide-y divide-zinc-100 dark:bg-base-900 dark:text-base-300 dark:outline-base-700 dark:divide-base-800"
                  style={{ top: navPos.top, left: navPos.left }}
                >
                  <div className="py-2 overflow-auto max-h-64">
                    {(
                      arguments[0]!.subsByCat![arguments[0]!.navCat || ""] || []
                    ).map((name) => (
                      <a
                        key={name}
                        href={`/playground/${arguments[0]!.navCat}/${name}/${clamp(arguments[0]!.navIdx || 1, 1, count(arguments[0]!.navCat || "", name))}`}
                        className="flex items-center justify-between w-full px-3 py-1.5 transition-colors hover:bg-base-100 dark:hover:bg-base-800/60"
                      >
                        <span className="capitalize">{fmt(name)}</span>
                        {arguments[0]!.navSub === name && (
                          <Check className="size-4 text-accent-600 dark:text-accent-400" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {navOpen === "idx" && (
                <div
                  ref={navMenuRef}
                  className="fixed z-50 w-40 mt-2 text-xs transition-colors bg-white shadow rounded-xl outline outline-zinc-100 text-zinc-600 dark:bg-base-900 dark:text-base-300 dark:outline-base-700"
                  style={{ top: navPos.top, left: navPos.left }}
                >
                  <div className="grid grid-cols-4 gap-1 px-2 py-2 overflow-auto max-h-64">
                    {Array.from(
                      {
                        length: count(
                          arguments[0]!.navCat || "",
                          arguments[0]!.navSub || "",
                        ),
                      },
                      (_, i) => i + 1,
                    ).map((n) => (
                      <a
                        key={n}
                        href={`/playground/${arguments[0]!.navCat}/${arguments[0]!.navSub}/${n}`}
                        className={`flex items-center justify-center px-2 py-1.5 transition-colors rounded hover:bg-base-100 dark:hover:bg-base-800/60 ${n === clamp(arguments[0]!.navIdx || 1, 1, count(arguments[0]!.navCat || "", arguments[0]!.navSub || "")) ? "text-accent-600 font-medium dark:text-accent-400" : "text-zinc-600 dark:text-base-200"}`}
                      >
                        {n}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* Pagination */}
              <div
                aria-hidden
                className="hidden h-4 w-[1px] bg-zinc-200 md:inline-block dark:bg-base-700"
              />
              {arguments[0]!.prevHref ? (
                <a
                  href={arguments[0]!.prevHref}
                  aria-label="Previous"
                  className="inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 text-zinc-600 hover:text-accent-600 dark:bg-base-900/60 dark:outline-base-700 dark:text-base-200 dark:hover:text-accent-400"
                >
                  <ChevronLeft className="size-4" />
                </a>
              ) : (
                <div className="inline-flex items-center justify-center size-7 opacity-50 rounded-md outline outline-1 outline-zinc-100 text-zinc-600 dark:outline-base-800 dark:text-base-400">
                  <ChevronLeft className="size-4" />
                </div>
              )}
              {arguments[0]!.nextHref ? (
                <a
                  href={arguments[0]!.nextHref}
                  aria-label="Next"
                  className="inline-flex items-center justify-center size-7 transition-colors rounded-md outline outline-1 outline-zinc-200 text-zinc-600 hover:text-accent-600 dark:bg-base-900/60 dark:outline-base-700 dark:text-base-200 dark:hover:text-accent-400"
                >
                  <ChevronRight className="size-4" />
                </a>
              ) : (
                <div className="inline-flex items-center justify-center size-7 opacity-50 rounded-md outline outline-1 outline-zinc-100 text-zinc-600 dark:outline-base-800 dark:text-base-400">
                  <ChevronRight className="size-4" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="relative flex w-full min-h-0 overflow-hidden bg-white rounded-xl shadow-oxbow z-1 isolate scrollbar-hide dark:bg-base-950/60">
        <PlaygroundShortcutsButton />
        {tab === "preview" && (
          <div className="flex flex-col items-center w-full bg-white scrollbar-hide dark:bg-base-950/60">
            <div
              ref={containerRef}
              id="playground-preview-container"
              className="flex flex-col w-full mx-auto text-base transition-colors bg-white shadow-normal scrollbar-hide dark:bg-base-950/80"
              style={{
                transition: "width 250ms ease-in-out, height 200ms ease",
              }}
            >
              <iframe
                ref={iframeRef}
                id={iframeId}
                className="block w-full border-0 transition-colors scrollbar-hide dark:bg-base-950"
                title={`Preview ${iframeSrc}`}
                style={{ height: "auto", visibility: "visible" }}
                src={iframeSrc}
                onLoad={() => {
                  requestHeight();
                  // apply current mode as soon as possible
                  applyModeToIframe(mode);
                  setTimeout(requestHeight, 50);
                  setTimeout(requestHeight, 650);
                }}
              />
            </div>
          </div>
        )}
        {canSeeCode && tab === "code" && (
          <div className="flex-grow p-4 text-xs transition-colors bg-white code-pane size-full selection:bg-zinc-100 scrollbar-hide dark:bg-base-950 dark:text-base-200 dark:selection:bg-base-800/60">
            {mode === "system" && !!arguments[0]?.highlightedSystem ? (
              <div
                className="overflow-x-auto scrollbar-hide"
                dangerouslySetInnerHTML={{
                  __html: arguments[0]!.highlightedSystem!,
                }}
              />
            ) : mode === "light" && !!arguments[0]?.highlightedLight ? (
              <div
                className="overflow-x-auto scrollbar-hide"
                dangerouslySetInnerHTML={{
                  __html: arguments[0]!.highlightedLight!,
                }}
              />
            ) : mode === "dark" && !!arguments[0]?.highlightedDark ? (
              <div
                className="overflow-x-auto scrollbar-hide"
                dangerouslySetInnerHTML={{
                  __html: arguments[0]!.highlightedDark!,
                }}
              />
            ) : (
              <pre className="overflow-x-auto text-zinc-800 whitespace-pre scrollbar-hide dark:text-base-200">
                <code>{codeText}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
