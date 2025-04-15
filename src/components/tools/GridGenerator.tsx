"use client";
import OxbowButton from "@/components/fundations/buttons/OxbowButton.astro";
import { useState, useRef, useCallback, useMemo } from "react";
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
  const gridRef = useRef<HTMLDivElement>(null);
  const gapSize = gap * 2; // Convert gap to pixels
  const getCellHeight = useCallback(
    () => 70,
    [],
  );
  const getCellWidth = useCallback(
    () => (gridRef.current?.clientWidth - gapSize * (columns - 1)) / columns,
    [gridRef, gapSize, columns],
  );
  const getGridHeight = useCallback(
    () => (rows * getCellHeight()) + (gapSize * (rows - 1)),
    [rows, getCellHeight, gapSize],
  );
  const getCellX = (x: number) => (x - 1) * getCellWidth() + gapSize * (x - 1);
  const getCellY = (y: number) => (y - 1) * getCellHeight() + gapSize * (y - 1);
  const xToCol = (x: number) => Math.round(x / (getCellWidth() + gapSize)) + 1;
  const yToRow = (y: number) => Math.round(y / (getCellHeight() + gapSize)) + 1;
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
  const onResizeStart = (id: string) => {
    setIsResizing(true);
  };
  const onResizeStop = (
    id: string,
    delta: { width: number; height: number },
  ) => {
    const item = items.find((item) => item.id === id);
    const width = item.w + Math.round(delta.width / (getCellWidth() + gapSize));
    const height = item.h + Math.round(delta.height / (getCellHeight() + gapSize));
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
    const gridClass = `grid grid-cols-${columns} grid-rows-${rows} gap-${gap}`;
    const itemsCode = items
      .map((item) => {
        const className = `col-start-${item.x} row-start-${item.y} col-span-${item.w} row-span-${item.h}`;
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
  return (
    <div >
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2  w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="columns" className="text-sm text-base-300">
            Columns
          </label>
          <input
            id="columns"
            type="number"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="block w-full h-12 px-4 py-2 text-sm text-white duration-300 bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-900 placeholder-base-400 focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 apearence-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="rows" className="text-sm text-base-300">
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="block w-full h-12 px-4 py-2 text-sm text-white duration-300 bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-900 placeholder-base-400 focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 apearence-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gap" className="text-sm text-base-300">
            Gap
          </label>
          <input
            id="gap"
            type="number"
            min={0}
            max={16}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="block w-full h-12 px-4 py-2 text-sm text-white duration-300 bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-900 placeholder-base-400 focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 apearence-none"
          />
        </div>
      </div>
      <div
        className="relative  w-full my-4"
      >
        <div
          ref={gridRef}
          className={`
              grid font-mono text-white text-sm text-center font-bold  w-full h-full
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
                className="flex items-center justify-center outline rounded-xl outline-base-900 shadow-2xl shadow-black bg-black p-8   cursor-pointer  relative text-2xl"
                onClick={() => handleAddItem(x, y)}
              >
                +
              </div>
            );
          })}
        </div>
        {items.map((item) => (
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
            className="flex items-center justify-center outline rounded-xl outline-base-900 shadow-2xl shadow-black bg-base-900 p-4 bg-stripes    cursor-pointer  relative "
          >
            <button
              onClick={() => handleRemoveItem(item.id)}
              onTouchEnd={() => handleRemoveItem(item.id)}
              className="absolute top-4 right-4  text-base-500 hover:text-white z-10"
              aria-label={`Remove item ${item.id}`}
            >
              <X className="size-4" />
            </button>
            <span className="text-white">{item.id.replace("item-", "")}</span>
            <div className="absolute bottom-4 right-4 size-6 rounded-bl flex items-center justify-center">
              <ArrowDownRight className="size-4 text-white" />
            </div>
          </Rnd>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full pt-4">
        <h3 className="text-white font-mono uppercase font-thin">Get your code</h3>
        <div className="flex items-center gap-2 ">
          <button
            className={`
                    flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950 hover:bg-base-400 focus:outline-base-900 ring-base-900 h-7 px-4 py-1.5 text-xs rounded-sm pointer-events-auto
                    ${format === "html" ? "!outline-base-700" : " "}
                  `}
            onClick={() => setFormat("html")}
          >
            HTML
          </button>
          <button
            className={`
                  flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950 hover:bg-base-400 focus:outline-base-900 ring-base-900 h-7 px-4 py-1.5 text-xs rounded-sm pointer-events-auto
                    ${format === "jsx" ? "!outline-base-700" : ""}
                  `}
            onClick={() => setFormat("jsx")}
          >
            JSX
          </button>
          <button
            className="flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950 hover:bg-base-400 focus:outline-base-900 ring-base-900 h-7 px-4 py-1.5 text-xs rounded-sm pointer-events-auto"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950 hover:bg-base-400 focus:outline-base-900 ring-base-900 h-7 px-4 py-1.5 text-xs rounded-sm pointer-events-auto w-20"
            onClick={handleCopy}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="bg-base-900 p-4 mt-2   outline rounded-xl outline-base-900 shadow-2xl shadow-black">
        <pre className="text-base-400 text-sm   overflow-x-auto">
          <code>{generateCode}</code>
        </pre>
      </div>
    </div>
  );
}
