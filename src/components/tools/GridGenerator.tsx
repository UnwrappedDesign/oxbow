"use client";
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
    () => 96,
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
      <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-2 ">
        <div className="flex flex-col gap-1">
          <label htmlFor="columns" className="text-sm text-zinc-500 ">
            Columns
          </label>
          <input
            id="columns"
            type="number"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-zinc-200 text-zinc-600 border-zinc-100 leading-6 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="rows" className="text-sm text-zinc-500 ">
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-zinc-200 text-zinc-600 border-zinc-100 leading-6 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gap" className="text-sm text-zinc-500 ">
            Gap
          </label>
          <input
            id="gap"
            type="number"
            min={0}
            max={16}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-zinc-200 text-zinc-600 border-zinc-100 leading-6 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div
        className="relative w-full my-4 "
      >
        <div
          ref={gridRef}
          className={`
              grid font-mono text-black     text-sm text-center font-bold  w-full h-full
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
                className="relative flex items-center justify-center p-8 text-2xl bg-white cursor-pointer  rounded-xl shadow-oxbow"
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
            className="relative flex items-center justify-center p-4 bg-white cursor-pointer  outline-2 rounded-xl outline-blue-600"
          >
            <button
              onClick={() => handleRemoveItem(item.id)}
              onTouchEnd={() => handleRemoveItem(item.id)}
              className="absolute z-10 top-4 right-4  text-zinc-500 hover:text-black"
              aria-label={`Remove item ${item.id}`}
            >
              <X className="size-4" />
            </button>
            <span className="text-black ">{item.id.replace("item-", "")}</span>
            <div className="absolute flex items-center justify-center rounded-bl bottom-4 right-4 ">
              <ArrowDownRight className="text-black size-4 " />
            </div>
          </Rnd>
        ))}
      </div>
      <div className="flex flex-col justify-between w-full pt-4 md:flex-row md:items-center">
        <h3 className="text-zinc-900 ">Get your code</h3>
        <div className="flex items-center gap-2 ">
          <button
            className={`
                    flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-7 px-4 py-2 text-xs rounded-md w-full  
                    ${format === "html" ? "!outline-zinc-700" : " "}
                  `}
            onClick={() => setFormat("html")}
          >
            HTML
          </button>
          <button
            className={`
                  flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-7 px-4 py-2 text-xs rounded-md w-full  
                    ${format === "jsx" ? "!outline-zinc-700" : ""}
                  `}
            onClick={() => setFormat("jsx")}
          >
            JSX
          </button>
          <button
            className="flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-center text-black bg-white shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-zinc-100 focus:outline-zinc-900 h-7 rounded-md "
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="flex items-center justify-center w-24 px-4 py-2 text-xs font-medium text-center text-black bg-white shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-zinc-100 focus:outline-zinc-900 h-7 rounded-md"
            onClick={handleCopy}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="p-4 mt-2 bg-white shadow-oxbow rounded-xl ">
        <pre className="overflow-x-auto text-xs text-zinc-500 ">
          <code>{generateCode}</code>
        </pre>
      </div>
    </div>
  );
}
