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
  "inline-flex items-center rounded-none border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "text-foreground border-border bg-background hover:bg-muted",
        success:
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        info:
          "border-transparent bg-sky-500 text-white hover:bg-sky-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }