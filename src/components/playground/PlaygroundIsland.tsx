import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  Code,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize,
  TerminalSquare,
} from "lucide-react";
type Mode = "light" | "dark";
type Tab = "preview" | "code";
type IdeTab =
  | "code"
  | "cursor"
  | "vsCode"
  | "openCode"
  | "claudeCode"
  | "claudeDesktop";
interface Props {
  iframeId: string;
  iframeSrc: string;
  initialTab: Tab;
  ppcode: string;
  highlightedSystem?: string;
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
  initialTab,
  ppcode,
  highlightedSystem,
  blockPath: _blockPath,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setModeState] = useState<Mode>("light");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const getGlobalMode = (): Mode => {
      const html = document.documentElement;
      const dataTheme = html.getAttribute("data-theme");
      if (dataTheme === "dark") return "dark";
      if (dataTheme === "light") return "light";
      if (html.classList.contains("dark")) return "dark";
      return window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
    };
    const syncMode = () => setModeState(getGlobalMode());
    syncMode();
    const observer = new MutationObserver(syncMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    window.addEventListener("storage", syncMode);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", syncMode);
    };
  }, []);
  const [tab, setTab] = useState<Tab>(initialTab || "preview");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );
  const [isCliModalOpen, setIsCliModalOpen] = useState(false);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [copiedInstallCommand, setCopiedInstallCommand] = useState(false);
  const [copiedMcpConfig, setCopiedMcpConfig] = useState(false);
  const [activeIdeTab, setActiveIdeTab] = useState<IdeTab>("code");
  const toolbarRootRef = useRef<HTMLDivElement | null>(null);
  const codeText = ppcode;
  const codePaneDark = mode === "dark";
  const applyModeToIframe = (m: Mode) => {
    const ifr = iframeRef.current;
    const doc = ifr?.contentDocument || ifr?.contentWindow?.document;
    const html = doc?.documentElement;
    const body = doc?.body || undefined;
    const enableDark = m === "dark";
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
    const onMessage = (e: MessageEvent) => {
      const data = (e?.data || {}) as {
        type?: string;
        id?: string;
        height?: number;
      };
      if (data.type !== "oxbow-height") return;
      if (data.id && data.id !== iframeId) return;
      const h = Number(data.height) || 0;
      if (h <= 0) return;
      const target = `${h}px`;
      const ifr = iframeRef.current;
      if (ifr && ifr.style.height !== target) ifr.style.height = target;
      const container = containerRef.current;
      if (container && container.style.height !== target) {
        container.style.height = target;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeId]);
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
      if (e.key === "Escape") {
        setIsCliModalOpen(false);
        setIsMcpModalOpen(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
    };
  }, [tab]);
  useEffect(() => {
    // Re-request height when returning to preview tab
    if (tab === "preview") {
      const t = setTimeout(requestHeight, 50);
      return () => clearTimeout(t);
    }
  }, [tab]);
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
  const parsedFromIframe = useMemo(() => {
    try {
      const url = new URL(iframeSrc, "http://localhost");
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 4 && parts[0] === "iframe") {
        return {
          section: parts[1],
          subsection: parts[2],
          index: parts[3],
        };
      }
    } catch {}
    return { section: "", subsection: "", index: "1" };
  }, [iframeSrc]);
  const activeSubsection = (
    arguments[0]?.navSub ||
    parsedFromIframe.subsection ||
    ""
  ).trim();
  const activeIndexRaw = `${arguments[0]?.navIdx || parsedFromIframe.index || "1"}`;
  const activeIndex = Math.max(1, Number.parseInt(activeIndexRaw, 10) || 1);
  const installCommand = `npx oxbowui add ${activeSubsection.replace(/-/g, " ")} ${activeIndex}`;
  const mcpConfigs: Record<IdeTab, string> = {
    code: `{
  "mcpServers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}`,
    cursor: `{
  "mcpServers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}`,
    vsCode: `{
  "servers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}`,
    openCode: `{
  "mcpServers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}`,
    claudeCode: `{
  "mcpServers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}`,
    claudeDesktop: `{
  "mcpServers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}`,
  };
  const activeMcpConfig = mcpConfigs[activeIdeTab];
  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedInstallCommand(true);
      setTimeout(() => setCopiedInstallCommand(false), 1200);
    } catch {}
  };
  const copyMcpConfig = async () => {
    try {
      await navigator.clipboard.writeText(activeMcpConfig);
      setCopiedMcpConfig(true);
      setTimeout(() => setCopiedMcpConfig(false), 1200);
    } catch {}
  };
  useEffect(() => {
    setCopiedMcpConfig(false);
  }, [activeIdeTab]);
  const openInNewWindow = () => {
    try {
      const url = new URL(iframeSrc, window.location.origin);
      url.searchParams.set("mode", mode);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {}
  };
  const ToolbarTooltip = ({
    label,
    className = "",
  }: {
    label: string;
    className?: string;
  }) => (
    <span
      className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${className}`}
    >
      {label}
    </span>
  );
  const ToolbarDivider = () => (
    <div className="w-px h-4 bg-muted hidden md:flex" aria-hidden="true" />
  );
  const iconButtonBase =
    "flex size-8 items-center justify-center rounded-md bg-muted transition-colors hover:bg-muted/70";
  const iconButtonText = "text-muted-foreground hover:text-foreground";
  const iconButtonActive = "text-foreground shadow-xs";
  const toolbarWrapperClass = "mx-auto px-8 w-full max-w-3xl";
  const previewWrapperClass = "max-w-screen 2xl:max-w-[1440px] w-full mx-auto px-8";
  return (
    <div className="relative">
      <div ref={toolbarRootRef} className={toolbarWrapperClass}>
        <div className="pb-2">
        {/* Left: index + tools */}
        <div className="flex items-center gap-2 w-full">
         <div className="items-center hidden gap-2 md:flex">
            <div className="relative group">
              <button
                type="button"
                onClick={copyUrl}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-muted px-2 text-xs transition-colors hover:bg-muted/70 ${copiedUrl ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                title="Copy block URL"
                aria-label="Copy block URL"
              >
                {copiedUrl ? <Check size={14} /> : iframeId.replace("iframe-", "")}
              </button>
              <ToolbarTooltip
                label="Copy URL"
                className="left-0 translate-x-0 px-2.5 py-1"
              />
            </div>
            <ToolbarDivider />
            <div className="items-center hidden gap-2 md:flex">
              <div className="relative group">
                <button
                  onClick={() => setTab("preview")}
                  className={`${iconButtonBase} ${tab === "preview" ? iconButtonActive : iconButtonText}`}
                >
                  <Eye size={14} />
                </button>
                <ToolbarTooltip label="Preview" />
              </div>
              <div className="relative group">
                <button
                  onClick={() => setTab("code")}
                  className={`${iconButtonBase} ${tab === "code" ? iconButtonActive : iconButtonText}`}
                >
                  <Code size={14} />
                </button>
                <ToolbarTooltip label="Code" />
              </div>
            </div>
            <ToolbarDivider />
        
              <span className="items-center hidden gap-2 md:flex">
                <div className="relative group">
                  <button
                    onClick={() => setViewportWidth("mobile")}
                    className={`${iconButtonBase} ${viewport === "mobile" ? iconButtonActive : iconButtonText}`}
                  >
                    <Smartphone size={14} />
                  </button>
                  <ToolbarTooltip label="Mobile view" />
                </div>
                <div className="relative group">
                  <button
                    onClick={() => setViewportWidth("tablet")}
                    className={`${iconButtonBase} ${viewport === "tablet" ? iconButtonActive : iconButtonText}`}
                  >
                    <Tablet size={14} />
                  </button>
                  <ToolbarTooltip label="Tablet view" />
                </div>
                <div className="relative group">
                  <button
                    onClick={() => setViewportWidth("desktop")}
                    className={`${iconButtonBase} ${viewport === "desktop" ? iconButtonActive : iconButtonText}`}
                  >
                    <Monitor size={14} />
                  </button>
                  <ToolbarTooltip label="Desktop view" />
                </div>
              </span>
                      <ToolbarDivider />

            <div className="relative group">
              <button
                onClick={copyCode}
                className={`${iconButtonBase} ${copiedCode ? "text-foreground" : iconButtonText}`}
                aria-label="Copy"
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <ToolbarTooltip label="Copy code" />
            </div>
            <div className="relative group">
              <button
                onClick={downloadCode}
                className={`${iconButtonBase} ${iconButtonText}`}
                aria-label="Download code"
              >
                <Download size={14} />
              </button>
              <ToolbarTooltip label="Download code" />
            </div>
            <div className="relative group">
              <button
                onClick={openInNewWindow}
                className={`${iconButtonBase} ${iconButtonText}`}
                aria-label="Open in new window"
              >
                <Maximize size={14} />
              </button>
              <ToolbarTooltip label="Open in new window" />
            </div>
            <div className="relative group">
              <button
                onClick={() => {
                  setIsMcpModalOpen(false);
                  setIsCliModalOpen(true);
                }}
                className={`${iconButtonBase} ${iconButtonText}`}
                aria-label="Install with Oxbow CLI"
              >
                <TerminalSquare size={14} />
              </button>
              <ToolbarTooltip label="Install with CLI" />
            </div>
            <div className="relative group">
              <button
                onClick={() => {
                  setIsCliModalOpen(false);
                  setIsMcpModalOpen(true);
                }}
                className={`${iconButtonBase} ${iconButtonText}`}
                aria-label="Install with MCP"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11 47.2749L46.5657 11.7093C51.4763 6.79872 59.438 6.79872 64.3483 11.7093C69.2591 16.6199 69.2591 24.5815 64.3483 29.4921L37.489 56.3516" stroke="currentColor" strokeWidth="6.28718" strokeLinecap="round"/>
                  <path d="M37.8599 55.9806L64.3486 29.4915C69.2594 24.5809 77.2211 24.5809 82.1319 29.4915L82.3169 29.6768C87.2277 34.5874 87.2277 42.549 82.3169 47.4596L50.151 79.6257C48.5142 81.2624 48.5142 83.9161 50.151 85.5529L56.7558 92.1581" stroke="currentColor" strokeWidth="6.28718" strokeLinecap="round"/>
                  <path d="M55.4575 20.6001L29.1536 46.9039C24.2431 51.8143 24.2431 59.776 29.1536 64.6868C34.0642 69.5971 42.0259 69.5971 46.9365 64.6868L73.2402 38.3829" stroke="currentColor" strokeWidth="6.28718" strokeLinecap="round"/>
                </svg>
              </button>
              <ToolbarTooltip label="Install with MCP" />
            </div>
          </div>
           <div className="flex items-center gap-2 ml-auto">
              {arguments[0]?.subsByCat && (
                <>

                  <div className="flex items-center gap-2">
                    {arguments[0]!.prevHref ? (
                      <a
                        href={arguments[0]!.prevHref}
                        aria-label="Previous"
                        className={`${iconButtonBase} ${iconButtonText}`}
                      >
                        <ChevronLeft size={14} />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center opacity-30 text-muted-foreground">
                        <ChevronLeft size={14} />
                      </div>
                    )}
                    {arguments[0]!.nextHref ? (
                      <a
                        href={arguments[0]!.nextHref}
                        aria-label="Next"
                        className={`${iconButtonBase} ${iconButtonText}`}
                      >
                        <ChevronRight size={14} />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center opacity-30 text-muted-foreground">
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </div>
                </>
              )}
           </div>
        </div>
        </div>
      </div>
      <div className={previewWrapperClass}>
        <div className="mt-4">
        <div className="relative flex w-full min-h-0 overflow-hidden z-1 isolate scrollbar-hide bg-background/60 ">
          {tab === "preview" && (
            <div className="flex flex-col items-center w-full scrollbar-hide bg-background/60  overflow-hidden border border-border rounded-lg shadow">
              <div
                ref={containerRef}
                id="playground-preview-container"
                className="flex flex-col w-full mx-auto text-base transition-colors shadow-normal scrollbar-hide bg-background/80"
                style={{
                  transition: "width 250ms ease-in-out, height 200ms ease",
                }}
              >
                <iframe
                  ref={iframeRef}
                  id={iframeId}
                  className="block w-full border-0 transition-colors scrollbar-hide bg-background"
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
          {tab === "code" && (
            <div className={`grow text-xs transition-colors code-pane border border-border  overflow-hidden rounded-lg shadow size-full scrollbar-hide bg-background text-foreground selection:bg-background/60 ${codePaneDark ? "dark" : ""}`}>
              {highlightedSystem ? (
                <div
                  className="overflow-x-auto scrollbar-hide"
                  dangerouslySetInnerHTML={{
                    __html: highlightedSystem,
                  }}
                />
              ) : (
                <pre className="overflow-x-auto whitespace-pre scrollbar-hide text-foreground">
                  <code>{codeText}</code>
                </pre>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
      {isCliModalOpen && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-background/30 backdrop-blur-[1px]"
          onClick={() => setIsCliModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-lg p-4 shadow-lg bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Install with CLI
              </p>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsCliModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">CLI command</p>
              <div className="mt-1 flex items-center gap-2 rounded-md bg-muted px-3 h-10 font-mono text-xs text-foreground">
                <span className="truncate">{installCommand}</span>
                <button
                  type="button"
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  onClick={copyInstallCommand}
                >
                  {copiedInstallCommand ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isMcpModalOpen && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-background/30 backdrop-blur-[1px]"
          onClick={() => setIsMcpModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-lg p-4 shadow-lg bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Install with MCP
              </p>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsMcpModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                MCP config
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors ${activeIdeTab === "code" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setActiveIdeTab("code")}
                >
                  Code
                </button>
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors ${activeIdeTab === "cursor" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setActiveIdeTab("cursor")}
                >
                  Cursor
                </button>
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors ${activeIdeTab === "vsCode" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setActiveIdeTab("vsCode")}
                >
                  VS Code
                </button>
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors ${activeIdeTab === "openCode" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setActiveIdeTab("openCode")}
                >
                  OpenCode
                </button>
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors ${activeIdeTab === "claudeCode" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setActiveIdeTab("claudeCode")}
                >
                  Claude Code
                </button>
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-[11px] transition-colors ${activeIdeTab === "claudeDesktop" ? "bg-muted text-foreground" : "bg-muted text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setActiveIdeTab("claudeDesktop")}
                >
                  Claude Desktop
                </button>
              </div>
              <div className="mt-2 rounded-md bg-muted p-3 font-mono text-xs text-foreground relative">
                <pre className="overflow-x-auto whitespace-pre">{activeMcpConfig}</pre>
                <button
                  type="button"
                  className="mt-2 text-xs text-muted-foreground hover:text-foreground absolute top-0 right-2"
                  onClick={copyMcpConfig}
                >
                  {copiedMcpConfig ? "Copied" : "Copy config"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
