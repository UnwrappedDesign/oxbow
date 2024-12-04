"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { X, ArrowDownRight } from 'lucide-react'
import { Rnd } from "react-rnd"

interface GridItem {
  id: string
  x: number
  y: number
  w: number
  h: number
}

export default function GridGenerator() {
  const [columns, setColumns] = useState(5)
  const [rows, setRows] = useState(5)
  const [gap, setGap] = useState(8)
  const [items, setItems] = useState<GridItem[]>([])
  const [format, setFormat] = useState("jsx")
  const gridRef = useRef<HTMLDivElement>(null)
  const gapSize = gap * 2 // Convert gap to pixels
  
  const getCellHeight = useCallback(() => (gridRef.current?.clientHeight - gapSize * (rows - 1)) / rows, [gridRef, gapSize, rows])
  const getCellWidth = useCallback(() => (gridRef.current?.clientWidth - gapSize * (columns - 1)) / columns, [gridRef, gapSize, columns])

  const getCellX = (x: number) => (x - 1) * getCellWidth() + gapSize * (x - 1)
  const getCellY = (y: number) => (y - 1) * getCellHeight() + gapSize * (y - 1)
  const xToCol = (x: number) => Math.round(x / (getCellWidth() + gapSize)) + 1
  const yToRow = (y: number) => Math.round(y / (getCellHeight() + gapSize)) + 1
  const getCellWidthPx = (w: number) => (w * getCellWidth()) + (w - 1) * gapSize
  const getCellHeightPx = (h: number) => (h * getCellHeight()) + (h - 1) * gapSize

  const handleAddItem = (x: number, y: number) => {
    const newItem: GridItem = {
      id: `item-${items.length + 1}`,
      x,
      y,
      w: 1,
      h: 1
    }
    setItems([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const onResizeStop = (id: string, ref: HTMLElement, delta: { width: number, height: number }) => {
    const item = items.find(item => item.id === id)

    const width = item.w + Math.round(delta.width / getCellWidth())
    const height = item.h + Math.round(delta.height / getCellHeight())

    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            w: width,
            h: height
          }
        : item
    ))
  }

  const onDragStop = (id: string, data: { x: number, y: number, deltaX: number, deltaY: number, lastX: number, lastY: number }) => {
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            x: xToCol(data.x),
            y: yToRow(data.y)
          }
        : item
    ))
  }

  const generateCode = useMemo(() => {
    const gridClass = `grid grid-cols-${columns} grid-rows-${rows} gap-${gap}`
    
    const itemsCode = items.map(item => {
      const className = `col-start-${item.x} row-start-${item.y} col-span-${item.w} row-span-${item.h}`
      
      if (format === "jsx") {
        return [`  <div key="${item.id}" className="${className}">`, `    ${item.id.replace('item-', '')}`, '  </div>'].join('\n')
      }
      return [`  <div class="${className}">`, `    ${item.id.replace('item-', '')}`, '  </div>'].join('\n')
    }).join('\n')
    
    return format === "html" ? [`<div class="${gridClass}">`, itemsCode, '</div>'].join('\n') : [`<div className="${gridClass}">`, itemsCode, '</div>'].join('\n')
  }, [format, columns, rows, gap, items])

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode)
  }

  const handleReset = () => {
    setItems([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b bg-base-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center gap-8 pb-12">
          <div className="space-y-2 ">
            <label htmlFor="columns">Columns</label>
            <input
              id="columns"
              type="number"
              min={1}
              max={12}
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="w-24 bg-gray-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="rows">Rows</label>
            <input
              id="rows"
              type="number"
              min={1}
              max={12}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-24 bg-gray-800 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="gap">Gap</label>
            <input
              id="gap"
              type="number"
              min={0}
              max={16}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-24 bg-gray-800 text-white"
            />
          </div>
        </div>

        <div className="relative rounded-lg w-full min-h-[600px]" style={{ height: gridRef.current?.clientHeight }}>
          <div
            ref={gridRef}
            className={`
              absolute top-0 left-0 grid font-mono text-white text-sm text-center font-bold rounded-lg w-full h-full
              grid-cols-${columns} grid-rows-${rows}
            `}
            style={{
              gridGap: `${gapSize}px`
            }}
          >
            {Array.from({ length: rows * columns }).map((_, index) => {
              const x = index % columns + 1
              const y = Math.floor(index / columns) + 1
              return (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 rounded-lg text-white relative bg-gray-700 text-2xl"
                  onClick={() => handleAddItem(x, y)}
                >
                  +
                </div>
              )
            })}
          </div>

          {items.map((item) => (
            <Rnd
              key={item.id}
              size={{ width: getCellWidthPx(item.w), height: getCellHeightPx(item.h) }}
              position={{ x: getCellX(item.x), y: getCellY(item.y) }}
              bounds="parent"
              enableResizing={{
                bottom: true,
                right: true,
                left: false,
                top: false
              }}
              onResizeStop={(e, d, ref, delta) => onResizeStop(item.id, ref, delta)}
              onDragStop={(e, data) => onDragStop(item.id, data)}
              className="bg-blue-100 rounded-lg p-4 flex items-center justify-center relative border-2 border-gray-500"
            >
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label={`Remove item ${item.id}`}
              >
                <X className="h-4 w-4" />
              </button>
              <span>{item.id.replace('item-', '')}</span>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-bl flex items-center justify-center">
                <ArrowDownRight className="h-3 w-3" />
              </div>
            </Rnd>
          ))}
        </div>
        <div className="flex justify-end gap-4 py-8">
            <button
              className="flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-base-500 bg-white hover:text-accent-500 ring-1 ring-base-200 focus:ring-accent-500 h-9 px-4 py-2 text-sm font-medium rounded-md"
              onClick={handleReset}
            >
              Reset
            </button>
            <button 
              className="flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-white bg-accent-600 hover:bg-accent-700 focus:ring-accent-500/50 h-9 px-4 py-2 text-sm font-medium rounded-md"
              onClick={handleCopy}
            >
              Copy
            </button>
        </div>
        <div className="flex justify-between items-start">
          <div className="flex justify-center p-12 mx-auto">
            <span className="inline-flex isolate">
              <button
                className={`
                  flex items-center justify-center focus:z-10 transition-all duration-300 focus:ring-2 focus:ring-offset-1 focus:outline-none text-base-500 ring-1 ring-base-200 focus:ring-accent-500 focus:ring-offset-white h-10 px-6 py-3 text-base font-medium rounded-l-md
                  ${format === "html" ? "bg-accent-500 text-white" : "text-base-500 bg-white hover:text-accent-500"}
                `}
                onClick={() => setFormat("html")}
              >
                HTML
              </button>
              <button
                className={`
                  flex items-center justify-center focus:z-10 transition-all duration-300 focus:ring-2 focus:ring-offset-1 focus:outline-none text-base-500 ring-1 ring-base-200 focus:ring-accent-500 focus:ring-offset-white h-10 px-6 py-3 text-base font-medium -ml-px rounded-r-lg 
                  ${format === "jsx" ? "bg-accent-500 text-white" : "text-base-500 bg-white hover:text-accent-500"}
                `}
                onClick={() => setFormat("jsx")}
              >
                JSX
              </button>
            </span>
          </div>


        </div>

        <div className="bg-gray-800 p-4">
          <pre className="text-gray-300 overflow-x-auto">
            <code>{generateCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

