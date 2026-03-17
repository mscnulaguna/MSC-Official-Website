"use client"

import { cn } from '@/lib/utils'
import loadingIcon from "@/assets/icons/loading-icon.svg"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  size?: number // pixel size of spinner
}

/**
 * Spinner Component
 * - Uses custom SVG from src/assets/icons/loading-icon.svg
 * - Only the image spins
 * - Fully accessible with role and aria-label
 */
export function Spinner({ className, size = 40, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('inline-block', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <img
        src={loadingIcon}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className="animate-spin object-contain"
      />
    </div>
  )
}

/**
 * RainbowLoader Component
 * - Spinning SVG with optional sizes: sm | md | lg
 * - Size mapping via pixels
 */
export function RainbowLoader({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 32, md: 48, lg: 64 } // px sizes
  return <Spinner size={sizeMap[size]} />
}

/**
 * Spinner with loading text below
 */
export function SpinnerWithText({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner size={48} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

/**
 * SpinnerCustom Component
 * - Wraps spinner with flex alignment and optional label
 */
export function SpinnerCustom() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Spinner size={64} />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  )
}