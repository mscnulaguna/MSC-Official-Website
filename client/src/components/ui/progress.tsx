'use client'

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

/**
 * Progress Component
 * ==================
 * - Thicker, boxed UI (straight edges, no rounded corners)
 * - Brand green fill: #6AAC0E
 * - Neutral gray background for unfilled portion
 * - Usage: <Progress value={50} className="w-64 h-6" />
 */

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative w-full overflow-hidden bg-gray-200 h-10", // thicker height, neutral background
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full transition-all"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundColor: "var(--color-brand-green)", // brand green fill
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }