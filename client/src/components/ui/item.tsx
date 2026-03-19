import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Item Components
 * ===============
 *
 * List item building blocks for displaying content.
 * Composable and flexible for various use cases.
 * Customized to match MSC Design System.
 */

const Item = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-gray-50 transition-colors",
        className
      )}
      {...props}
    />
  )
)
Item.displayName = "Item"

const ItemIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-shrink-0 flex items-center justify-center", className)}
      {...props}
    />
  )
)
ItemIcon.displayName = "ItemIcon"

const ItemContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
)
ItemContent.displayName = "ItemContent"

const ItemLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm font-semibold text-foreground", className)} {...props} />
  )
)
ItemLabel.displayName = "ItemLabel"

const ItemDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-xs text-muted-foreground mt-1", className)} {...props} />
  )
)
ItemDescription.displayName = "ItemDescription"

const ItemAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 flex items-center gap-2", className)} {...props} />
  )
)
ItemAction.displayName = "ItemAction"

export { Item, ItemIcon, ItemContent, ItemLabel, ItemDescription, ItemAction }
