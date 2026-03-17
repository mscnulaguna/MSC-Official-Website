import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Empty State Component
 * ====================
 *
 * Display when no data or results are available.
 * Clear messaging with icon and action button.
 * Customized to match MSC Design System.
 */

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon = <AlertCircle className="h-12 w-12 text-gray-400" />,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full py-12 px-4 text-center",
        className
      )}
      {...props}
    >
      {/* Icon */}
      <div className="mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  )
}

/**
 * Empty State Container
 * For wrapping multiple empty states or creating variations
 */
export const EmptyStateContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center w-full min-h-96 border border-dashed border-border rounded-lg bg-gray-50",
        className
      )}
      {...props}
    />
  )
)
EmptyStateContainer.displayName = "EmptyStateContainer"
