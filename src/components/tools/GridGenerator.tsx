"use client"

import { useState, useRef, useEffect } from "react"
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
  const gapSize = gap // Convert gap to pixels
  
  const calculateHeight = (rows: number) => (gridRef.current?.clientHeight || 0 - gapSize * (rows - 1)) / rows
  const calculateWidth = (columns: number) => (gridRef.current?.clientWidth || 100 - gapSize * (columns - 1)) / columns

  const handleAddItem = (event: React.MouseEvent, x: number, y: number) => {
    const clientHeight = gridRef.current?.clientHeight || 0
    const clientWidth = gridRef.current?.clientWidth || 0
    const cellHeight = (clientHeight - gapSize * (rows - 1)) / rows
    const cellWidth = (clientWidth - gapSize * (columns - 1)) / columns
  
    const newItem: GridItem = {
      id: `item-${items.length + 1}`,
      x: x * cellWidth + x * gapSize,
      y: y * cellHeight + y * gapSize,
      w: cellWidth,
      h: cellHeight
    }
    setItems([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const onResize = (id: string, ref: HTMLElement, position: { x: number; y: number }, delta: { width: number; height: number }) => {
    const clientHeight = gridRef.current?.clientHeight || 0
    const clientWidth = gridRef.current?.clientWidth || 0
    const cellHeight = (clientHeight - gapSize * (rows - 1)) / rows
    const cellWidth = (clientWidth - gapSize * (columns - 1)) / columns

    const item = items.find(item => item.id === id)
    if (!item) return

    const newWidth = item.w + delta.width
    const newHeight = item.h + delta.height

    const colSpan = Math.round(newWidth / (cellWidth + gapSize))
    const rowSpan = Math.round(newHeight / (cellHeight + gapSize))

    const adjustedWidth = colSpan * cellWidth + (colSpan - 1) * gapSize
    const adjustedHeight = rowSpan * cellHeight + (rowSpan - 1) * gapSize

    ref.style.width = `${adjustedWidth}px`
    ref.style.height = `${adjustedHeight}px`
  }


  const onResizeStop = (id: string, node: HTMLElement, position: { x: number, y: number }, delta: { width: number, height: number }) => {
    const clientHeight = gridRef.current?.clientHeight || 0
    const clientWidth = gridRef.current?.clientWidth || 0
    const cellHeight = (clientHeight - gapSize * (rows - 1)) / rows
    const cellWidth = (clientWidth - gapSize * (columns - 1)) / columns

    console.log(delta)
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            w: Math.round((item.w + delta.width) / (cellWidth + gapSize)) * cellWidth + (Math.round((item.w + delta.width) / (cellWidth + gapSize)) - 1) * gapSize,
            h: Math.round((item.h + delta.height) / (cellHeight + gapSize)) * cellHeight + (Math.round((item.h + delta.height) / (cellHeight + gapSize)) - 1) * gapSize
          }
        : item
    ))
  }

  const onDragStop = (id: string, data: { x: number, y: number, deltaX: number, deltaY: number, lastX: number, lastY: number }) => {
    const clientHeight = gridRef.current?.clientHeight || 0
    const clientWidth = gridRef.current?.clientWidth || 0
    const cellHeight = (clientHeight - gapSize * (rows - 1)) / rows
    const cellWidth = (clientWidth - gapSize * (columns - 1)) / columns

    const column = Math.round(data.x / (cellWidth + gapSize))
    const row = Math.round(data.y / (cellHeight + gapSize))

    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            x: column * cellWidth + column * gapSize,
            y: row * cellHeight + row * gapSize
          }
        : item
    ))
  }

  const generateCode = () => {
    const cellHeight = calculateHeight(rows)
    const cellWidth = calculateWidth(columns)

    const gridClass = `grid grid-cols-${columns} grid-rows-${rows} gap-[${gapSize}px]`
    
    const itemsCode = items.map(item => {
      const colSpan = Math.round((item.w + gapSize) / (cellWidth + gapSize))
      const rowSpan = Math.round((item.h + gapSize) / (cellHeight + gapSize))
      const colStart = Math.round(item.x / (cellWidth + gapSize)) + 1
      const rowStart = Math.round(item.y / (cellHeight + gapSize)) + 1  
      const className = `col-start-${colStart} row-start-${rowStart} col-span-${colSpan} row-span-${rowSpan}`
      
      if (format === "jsx") {
        return `  <div key="${item.id}" className="${className}">
    ${item.id.replace('item-', '')}
  </div>`
      }
      return `  <div class="${className}">
    ${item.id.replace('item-', '')}
  </div>`
    }).join('\n')
    
    if (format === "jsx") {
      return `<div className="${gridClass}">
${itemsCode}
</div>`
    }
    
    return `<div class="${gridClass}">
${itemsCode}
</div>`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode())
  }

  const handleReset = () => {
    setItems([])
  }

  useEffect(() => {
    generateCode()

  }, [format, columns, rows, gap])

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
              const x = index % columns
              const y = Math.floor(index / columns)
              return (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 rounded-lg text-white relative bg-gray-700 text-2xl"
                  onClick={(event) => handleAddItem(event, x, y)}
                >
                  +
                </div>
              )
            })}
          </div>

          {items.map((item) => (
            <Rnd
              key={item.id}
              size={{ width: item.w, height: item.h }}
              position={{ x: item.x, y: item.y }}
              bounds="parent"
              enableResizing={{
                bottom: true,
                right: true,
                left: false,
                top: false
              }}
              onResize={(e, direction, ref, delta, position) => onResize(item.id, ref, position, delta)}
              onResizeStop={(e, direction, ref, delta, position) => onResizeStop(item.id, ref, position, delta)}
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

        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <input type="radio" value="jsx" id="jsx" name="format" onChange={(e) => setFormat(e.target.value)} />
            <label htmlFor="jsx">JSX</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="radio" value="html" id="html" name="format" onChange={(e) => setFormat(e.target.value)} />
            <label htmlFor="html">HTML</label>
          </div>

          <div className="flex gap-4">
            <button onClick={handleReset}>
              Reset
            </button>
            <button onClick={handleCopy}>
              Copy
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4">
          <pre className="text-gray-300 overflow-x-auto">
            <code>{generateCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

