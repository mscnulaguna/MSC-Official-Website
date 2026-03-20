'use client'

import { useState, useEffect } from 'react'

type BlockColor = 'blue' | 'green' | 'yellow' | 'red'
type BlockShape = 'single' | 'l-shape' | 'z-shape' | 'i-shape' | 'o-shape' | 't-shape' | 's-shape' | 'j-shape'

interface RenderedBlock {
  id: string
  shape: BlockShape
  color: BlockColor
  x: number  // percentage from left
  y: number  // percentage from top
}

interface Layout {
  id: number
  blocks: RenderedBlock[]
}

// Brand colors
const colorClasses: Record<BlockColor, string> = {
  blue: 'bg-[var(--color-brand-blue)]',
  green: 'bg-[var(--color-brand-green)]',
  yellow: 'bg-[var(--color-brand-yellow)]',
  red: 'bg-[var(--color-brand-red)]',
}

// Block cell size for tetris blocks
const CELL_SIZE = 40

// Safe zone definition - blocks avoid this area (center where text lives)
const SAFE_ZONE = {
  minX: 35,    // 35% from left
  maxX: 65,    // 65% from left
  minY: 30,    // 30% from top
  maxY: 70,    // 70% from top
}

// Available shapes with their dimensions
const SHAPE_DIMENSIONS: Record<BlockShape, { width: number; height: number }> = {
  'single': { width: 1, height: 1 },      // 40x40
  'o-shape': { width: 2, height: 2 },     // 80x80 (square)
  'i-shape': { width: 4, height: 1 },     // 160x40
  'l-shape': { width: 2, height: 3 },     // 80x120
  'j-shape': { width: 2, height: 3 },     // 80x120
  't-shape': { width: 3, height: 2 },     // 120x80
  'z-shape': { width: 3, height: 2 },     // 120x80
  's-shape': { width: 3, height: 2 },     // 120x80
}

/**
 * Checks if a block position is safe (not in center, not overlapping)
 */
function isPositionSafe(x: number, y: number, shape: BlockShape, existingBlocks: RenderedBlock[]): boolean {
  const dims = SHAPE_DIMENSIONS[shape]
  const blockWidthPct = (dims.width * CELL_SIZE) / window.innerWidth * 100
  const blockHeightPct = (dims.height * CELL_SIZE) / window.innerHeight * 100

  // Check if block intersects with safe zone
  const blockRight = x + blockWidthPct
  const blockBottom = y + blockHeightPct

  // Avoid center safe zone
  if (
    x < SAFE_ZONE.maxX &&
    blockRight > SAFE_ZONE.minX &&
    y < SAFE_ZONE.maxY &&
    blockBottom > SAFE_ZONE.minY
  ) {
    return false
  }

  // Check for overlaps with existing blocks
  for (const existing of existingBlocks) {
    const existingDims = SHAPE_DIMENSIONS[existing.shape]
    const existingWidthPct = (existingDims.width * CELL_SIZE) / window.innerWidth * 100
    const existingHeightPct = (existingDims.height * CELL_SIZE) / window.innerHeight * 100
    const existingRight = existing.x + existingWidthPct
    const existingBottom = existing.y + existingHeightPct

    // Check for collision
    if (
      x < existingRight + 3 &&
      blockRight > existing.x - 3 &&
      y < existingBottom + 3 &&
      blockBottom > existing.y - 3
    ) {
      return false
    }
  }

  // Block must be within viewport boundaries with padding
  if (x < 0 || blockRight > 100 || y < 0 || blockBottom > 100) {
    return false
  }

  return true
}

/**
 * Generate a random position trying to place blocks in outer areas
 */
function getRandomPosition(): { x: number; y: number } | null {
  const maxAttempts = 20
  let attempts = 0

  while (attempts < maxAttempts) {
    attempts++
    // Bias towards corners and edges
    const quadrant = Math.floor(Math.random() * 4)
    let x: number
    let y: number

    if (quadrant === 0) {
      // Top-left corner
      x = Math.random() * 25
      y = Math.random() * 25
    } else if (quadrant === 1) {
      // Top-right corner
      x = 75 + Math.random() * 25
      y = Math.random() * 25
    } else if (quadrant === 2) {
      // Bottom-left corner
      x = Math.random() * 25
      y = 75 + Math.random() * 25
    } else {
      // Bottom-right corner
      x = 75 + Math.random() * 25
      y = 75 + Math.random() * 25
    }

    return { x, y }
  }

  return null
}

/**
 * Generate a random layout with randomized block count, shapes, and positions
 */
function generateRandomLayout(layoutId: number): Layout {
  // Random block count between 3 and 9
  const blockCount = Math.floor(Math.random() * 7) + 3

  const allShapes: BlockShape[] = ['single', 'l-shape', 'z-shape', 'i-shape', 'o-shape', 't-shape', 's-shape', 'j-shape']
  const allColors: BlockColor[] = ['blue', 'green', 'yellow', 'red']

  const blocks: RenderedBlock[] = []
  let attempts = 0
  const maxAttempts = blockCount * 10

  while (blocks.length < blockCount && attempts < maxAttempts) {
    attempts++

    // Random shape and color
    const shape = allShapes[Math.floor(Math.random() * allShapes.length)]
    const color = allColors[Math.floor(Math.random() * allColors.length)]
    const pos = getRandomPosition()

    if (!pos) continue

    // Check if position is safe
    if (isPositionSafe(pos.x, pos.y, shape, blocks)) {
      blocks.push({
        id: `block-${layoutId}-${blocks.length}`,
        shape,
        color,
        x: pos.x,
        y: pos.y,
      })
    }
  }

  return { id: layoutId, blocks }
}

/**
 * SingleBlock - 1×1 tetris piece
 */
function SingleBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  return (
    <div
      className={`rounded-sm ${colorClass}`}
      style={{
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
      }}
      aria-hidden="true"
    />
  )
}

/**
 * LShapeBlock - L-shaped tetris piece
 */
function LShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 2}px`,
        height: `${cellWithGap * 3}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: cellWithGap }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: cellWithGap * 2 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap * 2 }} />
    </div>
  )
}

/**
 * JShapeBlock - J-shaped tetris piece (mirror of L)
 */
function JShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 2}px`,
        height: `${cellWithGap * 3}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap * 2 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: cellWithGap * 2 }} />
    </div>
  )
}

/**
 * TShapeBlock - T-shaped tetris piece
 */
function TShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 3}px`,
        height: `${cellWithGap * 2}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap * 2, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap }} />
    </div>
  )
}

/**
 * ZShapeBlock - Z-shaped tetris piece
 */
function ZShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 3}px`,
        height: `${cellWithGap * 2}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap * 2, top: cellWithGap }} />
    </div>
  )
}

/**
 * SShapeBlock - S-shaped tetris piece
 */
function SShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 3}px`,
        height: `${cellWithGap * 2}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap * 2, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: cellWithGap }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap }} />
    </div>
  )
}

/**
 * IShapeBlock - I-shaped tetris piece (straight line horizontal)
 */
function IShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 4}px`,
        height: `${cellWithGap}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap * 2, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap * 3, top: 0 }} />
    </div>
  )
}

/**
 * OShapeBlock - O-shaped tetris piece (square)
 */
function OShapeBlock({ color }: { color: BlockColor }) {
  const colorClass = colorClasses[color]
  const cellWithGap = CELL_SIZE
  return (
    <div
      className="relative"
      style={{
        width: `${cellWithGap * 2}px`,
        height: `${cellWithGap * 2}px`,
      }}
      aria-hidden="true"
    >
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: 0 }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: 0, top: cellWithGap }} />
      <div className={`absolute rounded-sm ${colorClass}`} style={{ width: CELL_SIZE, height: CELL_SIZE, left: cellWithGap, top: cellWithGap }} />
    </div>
  )
}

/**
 * Renders a block based on its shape
 */
function BlockRenderer({ shape, color }: { shape: BlockShape; color: BlockColor }) {
  switch (shape) {
    case 'single':
      return <SingleBlock color={color} />
    case 'l-shape':
      return <LShapeBlock color={color} />
    case 'j-shape':
      return <JShapeBlock color={color} />
    case 't-shape':
      return <TShapeBlock color={color} />
    case 'z-shape':
      return <ZShapeBlock color={color} />
    case 's-shape':
      return <SShapeBlock color={color} />
    case 'i-shape':
      return <IShapeBlock color={color} />
    case 'o-shape':
      return <OShapeBlock color={color} />
    default:
      return <SingleBlock color={color} />
  }
}

export function TetrisBlocksBackground() {
  const [layout, setLayout] = useState<Layout>(() => generateRandomLayout(0))

  // Switch to a new random layout every 3-5 seconds (instant, no animation)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    
    const scheduleNextLayout = () => {
      const nextDelay = Math.floor(Math.random() * 2000) + 3000 // 3-5 seconds
      timeoutId = setTimeout(() => {
        setLayout((prevLayout) => generateRandomLayout(prevLayout.id + 1))
        scheduleNextLayout()
      }, nextDelay)
    }

    scheduleNextLayout()
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Random layout blocks - instant switch, no animations, faded */}
      <div className="absolute inset-0">
        {layout.blocks.map((block) => (
          <div
            key={block.id}
            style={{
              position: 'absolute',
              left: `${block.x}%`,
              top: `${block.y}%`,
              opacity: 0.25,
              // NO transitions - instant placement
            }}
          >
            <BlockRenderer shape={block.shape} color={block.color} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TetrisBlocksBackground
