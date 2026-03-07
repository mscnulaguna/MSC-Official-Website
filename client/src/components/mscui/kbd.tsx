import * as React from "react"
import { cn } from "@/lib/utils"

const KBD = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-1 font-mono text-xs font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
))
KBD.displayName = "KBD"

export { KBD }
