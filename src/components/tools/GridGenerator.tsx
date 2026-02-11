"use client";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import type { Highlighter } from "shiki";
import { X, ArrowDownRight } from "lucide-react";
import { Rnd } from "react-rnd";
interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
export default function GridGenerator() {
  const [columns, setColumns] = useState(4);
  const [rows, setRows] = useState(4);
  const [gap, setGap] = useState(4);
  const [items, setItems] = useState<GridItem[]>([]);
  const [format, setFormat] = useState("jsx");
  const [isCopied, setIsCopied] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [highlightFailed, setHighlightFailed] = useState(false);
  const [cellSize, setCellSize] = useState({ width: 0, height: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const highlighterCache = useRef<{
    highlighter: Highlighter | null;
    themeName: string;
    loading: Promise<void> | null;
  }>({ highlighter: null, themeName: "github-light", loading: null });
  const gapSize = gap * 2; // Convert gap to pixels
  const getCellHeight = useCallback(
    () => cellSize.height || 96,
    [cellSize.height],
  );
  const getCellWidth = useCallback(() => {
    if (cellSize.width) return cellSize.width;
    const width = gridRef.current?.clientWidth;
    if (!width) return 0;
    return (width - gapSize * (columns - 1)) / columns;
  }, [cellSize.width, gapSize, columns]);
  const getGridHeight = useCallback(
    () => (rows * getCellHeight()) + (gapSize * (rows - 1)),
    [rows, getCellHeight, gapSize],
  );
  const getCellX = (x: number) => (x - 1) * getCellWidth() + gapSize * (x - 1);
  const getCellY = (y: number) => (y - 1) * getCellHeight() + gapSize * (y - 1);
  const xToCol = (x: number) => {
    const width = getCellWidth();
    if (!width) return 1;
    const col = Math.round(x / (width + gapSize)) + 1;
    return Math.min(columns, Math.max(1, col));
  };
  const yToRow = (y: number) => {
    const height = getCellHeight();
    if (!height) return 1;
    const row = Math.round(y / (height + gapSize)) + 1;
    return Math.min(rows, Math.max(1, row));
  };
  const getCellWidthPx = (w: number) => w * getCellWidth() + (w - 1) * gapSize;
  const getCellHeightPx = (h: number) =>
    h * getCellHeight() + (h - 1) * gapSize;
  const handleAddItem = (x: number, y: number) => {
    const newItem: GridItem = {
      id: `item-${items.length + 1}`,
      x,
      y,
      w: 1,
      h: 1,
    };
    setItems([...items, newItem]);
  };
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };
  const onResizeStart = (_id: string) => {
    setIsResizing(true);
  };
  const onResizeStop = (
    id: string,
    delta: { width: number; height: number },
  ) => {
    const item = items.find((item) => item.id === id);
    const cellWidth = getCellWidth();
    const cellHeight = getCellHeight();
    const width = cellWidth
      ? item.w + Math.round(delta.width / (cellWidth + gapSize))
      : item.w;
    const height = cellHeight
      ? item.h + Math.round(delta.height / (cellHeight + gapSize))
      : item.h;
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              w: width,
              h: height,
            }
          : item,
      ),
    );
    setIsResizing(false);
  };
  const onDragStop = (
    id: string,
    data: {
      x: number;
      y: number;
      deltaX: number;
      deltaY: number;
      lastX: number;
      lastY: number;
    },
  ) => {
    if (isResizing) return;
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              x: xToCol(data.x),
              y: yToRow(data.y),
            }
          : item,
      ),
    );
  };
  const generateCode = useMemo(() => {
    const gridClasses = [
      "grid",
      "grid-cols-1",
      `md:grid-cols-${columns}`,
      `gap-${gap}`,
    ];
    if (rows > 1) {
      gridClasses.push(`md:grid-rows-${rows}`);
    }
    const gridClass = gridClasses.join(" ");

    const itemsCode = items
      .map((item) => {
        const itemClasses = [
          `md:col-start-${item.x}`,
          `md:row-start-${item.y}`,
          `md:col-span-${item.w}`,
          `md:row-span-${item.h}`,
          "flex",
          "items-center",
          "justify-center",
          "bg-zinc-100",
          "dark:bg-zinc-800",
          "p-6",
          "text-sm",
          "font-semibold",
          "text-zinc-900",
          "dark:text-zinc-100",
        ];
        const className = itemClasses.join(" ");
        if (format === "jsx") {
          return [
            `  <div key="${item.id}" className="${className}">`,
            `    ${item.id.replace("item-", "")}`,
            "  </div>",
          ].join("\n");
        }
        return [
          `  <div class="${className}">`,
          `    ${item.id.replace("item-", "")}`,
          "  </div>",
        ].join("\n");
      })
      .join("\n");

    return format === "html"
      ? [`<div class="${gridClass}">`, itemsCode, "</div>"].join("\n")
      : [`<div className="${gridClass}">`, itemsCode, "</div>"].join("\n");
  }, [format, columns, rows, gap, items]);
  useEffect(() => {
    const updateCellSize = () => {
      const gridEl = gridRef.current;
      if (!gridEl) return;
      const firstCell = gridEl.querySelector<HTMLDivElement>("[data-grid-cell]");
      if (!firstCell) return;
      const rect = firstCell.getBoundingClientRect();
      setCellSize({ width: rect.width, height: rect.height });
    };

    updateCellSize();

    const gridEl = gridRef.current;
    if (!gridEl) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateCellSize());
      resizeObserver.observe(gridEl);
    }
    window.addEventListener("resize", updateCellSize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateCellSize);
    };
  }, [columns, rows, gap]);
  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  const handleReset = () => {
    setItems([]);
  };
  useEffect(() => {
    let cancelled = false;
    const highlight = async () => {
      const code = generateCode;
      if (!code) {
        setHighlightedCode("");
        return;
      }
      try {
        if (!highlighterCache.current.highlighter) {
          if (!highlighterCache.current.loading) {
            highlighterCache.current.loading = (async () => {
              const { createHighlighter } = await import("shiki");
              highlighterCache.current.themeName = "github-light";
              highlighterCache.current.highlighter = await createHighlighter({
                themes: ["github-light", "github-dark"],
                langs: ["html", "jsx", "tsx"],
              });
            })();
          }
          await highlighterCache.current.loading;
        }
        if (!highlighterCache.current.highlighter) return;
        const lang = format === "html" ? "html" : "tsx";
        const html: string = await highlighterCache.current.highlighter.codeToHtml(
          code,
          {
            lang,
            theme: highlighterCache.current.themeName,
          },
        );
        if (!cancelled) {
          setHighlightedCode(html);
          setHighlightFailed(false);
        }
      } catch (error) {
        console.error("Failed to highlight grid output", error);
        if (!cancelled) {
          setHighlightedCode("");
          setHighlightFailed(true);
        }
      }
    };
    highlight();
    return () => {
      cancelled = true;
    };
  }, [generateCode, format]);
  return (
    <div>
      <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="columns" className="text-sm text-base-500 dark:text-base-400">
            Columns
          </label>
          <input
            id="columns"
            type="number"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full h-10 px-3 py-2 text-sm bg-white dark:bg-base-800 border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 dark:focus:border-white/20 text-base-600 dark:text-base-100 border-base-100 dark:border-white/10 leading-6 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="rows" className="text-sm text-base-500 dark:text-base-400">
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full h-10 px-3 py-2 text-sm bg-white dark:bg-base-800 border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 dark:focus:border-white/20 text-base-600 dark:text-base-100 border-base-100 dark:border-white/10 leading-6 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gap" className="text-sm text-base-500 dark:text-base-400">
            Gap
          </label>
          <input
            id="gap"
            type="number"
            min={0}
            max={16}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-full h-10 px-3 py-2 text-sm bg-white dark:bg-base-800 border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 dark:focus:border-white/20 text-base-600 dark:text-base-100 border-base-100 dark:border-white/10 leading-6 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div
        className="relative w-full my-4"
      >
        <div
          ref={gridRef}
          className={`
              grid font-mono text-base-900 dark:text-base-100 text-sm text-center font-bold w-full h-full
              grid-cols-${columns} grid-rows-${rows}
            `}
          style={{
            gridGap: `${gapSize}px`,
            minHeight: getGridHeight()
          }}
        >
          {Array.from({ length: rows * columns }).map((_, index) => {
            const x = (index % columns) + 1;
            const y = Math.floor(index / columns) + 1;
            return (
              <div
                key={index}
                data-grid-cell
                className="relative flex items-center justify-center p-8 text-2xl bg-base-50 dark:bg-base-900 cursor-pointer rounded-lg   border border-base-200 dark:border-base-700"
                onClick={() => handleAddItem(x, y)}
              >
                <span className="text-base-400 dark:text-base-500">+</span>
              </div>
            );
          })}
        </div>
        {items.map((item) => {
          const snap = (() => {
            const width = getCellWidth();
            const height = getCellHeight();
            if (!width || !height) return null;
            return [width + gapSize, height + gapSize] as [number, number];
          })();

          return (
            <Rnd
              key={item.id}
              size={{
                width: getCellWidthPx(item.w),
                height: getCellHeightPx(item.h),
              }}
              position={{ x: getCellX(item.x), y: getCellY(item.y) }}
              bounds="parent"
              enableResizing={{
                bottom: true,
                right: true,
                left: false,
                top: false,
              }}
              onResizeStart={() =>
                onResizeStart(item.id)
              }
              onResizeStop={(e, d, ref, delta) =>
                onResizeStop(item.id, delta)
              }
              onDragStop={(e, data) => onDragStop(item.id, data)}
              {...(snap ? { dragGrid: snap } : {})}
              className="relative flex items-center justify-center p-6 bg-white outline outline-base-200 dark:outline-base-800 dark:bg-base-800 cursor-pointer  text-sm font-semibold text-base-900 dark:text-base-100"
            >
              <button
                onClick={() => handleRemoveItem(item.id)}
                onTouchEnd={() => handleRemoveItem(item.id)}
                className="absolute z-10 top-4 right-4 text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-base-200"
                aria-label={`Remove item ${item.id}`}
              >
                <X className="size-4" />
              </button>
              <span className="text-base-900 dark:text-base-100">{item.id.replace("item-", "")}</span>
              <div className="absolute flex items-center justify-center rounded-bl bottom-4 right-4">
                <ArrowDownRight className="text-base-900 dark:text-base-100 size-4" />
              </div>
            </Rnd>
          );
        })}
      </div>
      <div className="flex flex-col justify-between w-full pt-4 md:flex-row md:items-center">
        <h3 className="text-base-900 dark:text-base-100">Get your code</h3>
        <div className="flex items-center gap-2">
          <button
            className={`
                    flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-7 px-4 py-2 text-xs rounded-md w-full
                    ${format === "html" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}
                  `}
            onClick={() => setFormat("html")}
          >
            HTML
          </button>
          <button
            className={`
                  flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-7 px-4 py-2 text-xs rounded-md w-full
                    ${format === "jsx" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}
                  `}
            onClick={() => setFormat("jsx")}
          >
            JSX
          </button>
          <button
            className="flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-center text-base-900 dark:text-base-100 bg-white dark:bg-base-800 shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-7 rounded-md"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="flex items-center justify-center w-24 px-4 py-2 text-xs font-medium text-center text-base-900 dark:text-base-100 bg-white dark:bg-base-800 shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-7 rounded-md"
            onClick={handleCopy}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="  border border-base-200 dark:border-base-800 overflow-hidden scrollbar-hide text-xs bg-white">
          {highlightedCode ? (
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          ) : (
            <pre className="astro-code">
              <code>{generateCode}</code>
            </pre>
          )}
        </div>
        {highlightFailed && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Syntax highlighting is temporarily unavailable; showing plain text.
          </p>
        )}
      </div>
    </div>
  );
}
