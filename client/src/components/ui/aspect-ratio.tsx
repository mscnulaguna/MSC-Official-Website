import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Aspect Ratio Component
 * ======================
 *
 * Maintains aspect ratio for media containers.
 * Useful for images, videos, and other media.
 * Responsive and CSS-based sizing.
 * Customized to match MSC Design System.
 */

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, ...props }, ref) => {
    const aspectRatioClasses = {
      "1/1": "aspect-square",
      "3/2": "aspect-[3/2]",
      "4/3": "aspect-[4/3]",
      "16/9": "aspect-video",
      "9/16": "aspect-[9/16]",
      "3/4": "aspect-[3/4]",
    } as Record<string, string>

    const ratioStr = ratio.toString()
    const aspectClass = aspectRatioClasses[ratioStr] ?? `aspect-[${ratio}]`

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-lg bg-muted", aspectClass, className)}
        {...props}
      />
    )
  }
)
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
