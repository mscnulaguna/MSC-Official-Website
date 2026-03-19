import * as React from "react"
import { cn } from "@/lib/utils"

interface BlinkingCursorProps extends React.ComponentProps<'span'> {
  className?: string
}

const BlinkingCursor = React.forwardRef<HTMLSpanElement, BlinkingCursorProps>(
  ({ className, ...props }, ref) => (
    <span
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
