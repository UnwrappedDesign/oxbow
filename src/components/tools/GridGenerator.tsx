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
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState<GridItem[]>([]);
  const [format, setFormat] = useState("jsx");
  const [isCopied, setIsCopied] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const gapSize = gap * 2; // Convert gap to pixels

  const getCellHeight = useCallback(
    () => (gridRef.current?.clientHeight - gapSize * (rows - 1)) / rows,
    [gridRef, gapSize, rows],
  );
  const getCellWidth = useCallback(
    () => (gridRef.current?.clientWidth - gapSize * (columns - 1)) / columns,
    [gridRef, gapSize, columns],
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

    const width = item.w + Math.round(delta.width / getCellWidth());
    const height = item.h + Math.round(delta.height / getCellHeight());

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="columns" className="text-sm text-base-500">
            Columns
          </label>
          <input
            id="columns"
            type="number"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="block w-full px-4 py-2 h-10  border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="rows" className="text-sm text-base-500">
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="block w-full px-4 py-2 h-10  border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gap" className="text-sm text-base-500">
            Gap
          </label>
          <input
            id="gap"
            type="number"
            min={0}
            max={16}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="block w-full px-4 py-2 h-10  border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      <div
        className="relative rounded-lg w-full mt-8 min-h-[600px]"
        style={{ height: gridRef.current?.clientHeight }}
      >
        <div
          ref={gridRef}
          className={`
              absolute top-0 left-0 grid font-mono text-white text-sm text-center font-bold rounded-lg w-full h-full
              grid-cols-${columns} grid-rows-${rows}
            `}
          style={{
            gridGap: `${gapSize}px`,
          }}
        >
          {Array.from({ length: rows * columns }).map((_, index) => {
            const x = (index % columns) + 1;
            const y = Math.floor(index / columns) + 1;
            return (
              <div
                key={index}
                className="flex items-center justify-center p-4 rounded-lg text-accent-500  relative border border-base-200  ring-4 ring-base-100 bg-white text-2xl"
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
            className="bg-white rounded-lg p-4 flex items-center justify-center relative ring-2 ring-accent-500"
          >
            <button
              onClick={() => handleRemoveItem(item.id)}
              onTouchEnd={() => handleRemoveItem(item.id)}
              className="absolute top-2 right-2 p-3 text-base-500 hover:text-base-700 z-10"
              aria-label={`Remove item ${item.id}`}
            >
              <X className="size-4" />
            </button>
            <span>{item.id.replace("item-", "")}</span>
            <div className="absolute bottom-0 right-0 size-6 rounded-bl flex items-center justify-center">
              <ArrowDownRight className="size-4 text-accent-500" />
            </div>
          </Rnd>
        ))}
      </div>
      <div className="flex items-center justify-between w-full mt-12">
          <h3 className="texr-base-500 text-base">Get your code</h3>
        
        <div className="flex items-center gap-2 ">
          <button
            className={`
                    pointer-events-auto flex focus:text-accent-500 rounded-md px-4 h-7 py-1 text-sm  transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200
                    ${format === "html" ? "bg-white text-accent-500" : "text-base-500 "}
                  `}
            onClick={() => setFormat("html")}
          >
            HTML
          </button>
          <button
            className={`
                    pointer-events-auto flex focus:text-accent-500 rounded-md px-4 h-7 py-1 text-sm  transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200
                    ${format === "jsx" ? "bg-white text-accent-500" : "text-base-500"}
                  `}
            onClick={() => setFormat("jsx")}
          >
            JSX
          </button>
          <button
            className="pointer-events-auto relative w-20 flex rounded-md focus:text-accent-500 px-4 py-1 text-sm text-base-900 transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="pointer-events-auto relative w-20 flex rounded-md focus:text-accent-500 px-4 py-1 text-sm text-base-900 transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200"
            onClick={handleCopy}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 mt-2 rounded-lg ring-4 ring-base-100 border border-base-200">
        <pre className="text-accent-500   overflow-x-auto">
          <code>{generateCode}</code>
        </pre>
      </div>
    </div>
  );
}
