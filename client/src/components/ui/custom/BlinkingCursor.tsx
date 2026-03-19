import * as React from "react"
import { cn } from "@/lib/utils"

interface BlinkingCursorProps extends React.ComponentProps<'div'> {
  className?: string
}

const BlinkingCursor = React.forwardRef<HTMLDivElement, BlinkingCursorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-block h-[0.8em] w-[2px] animate-blink bg-foreground",
        className
      )}
      {...props}
    />
  )
)

BlinkingCursor.displayName = "BlinkingCursor"

export { BlinkingCursor }
