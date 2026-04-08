import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Badge Component
 * =================
 * - Boxed edges (no rounded corners)
 * - Color variants: default, secondary, destructive, outline
 * - Usage: <Badge variant="default">New</Badge>
 */

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-3 py-1 text-xs font-sans font-normal capitalize tracking-normal transition-[filter,color,background-color,border-color]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:brightness-90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:brightness-90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:brightness-90",
        outline:
          "text-foreground border-border bg-background hover:bg-muted",
        success:
          "border-transparent bg-success text-white hover:brightness-90",
        warning:
          "border-transparent bg-warning text-white hover:brightness-90",
        info:
          "border-transparent bg-info text-white hover:brightness-90",
        accent:
          "border-transparent bg-accent text-white hover:brightness-90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: Readonly<BadgeProps>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }