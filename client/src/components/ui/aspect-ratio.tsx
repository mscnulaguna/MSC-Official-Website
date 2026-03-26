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

// DEFAULT CODE - base aspect ratio interface
interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

// DEFAULT CODE with customization // added forwardRef for ref support
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, ...props }, ref) => {
    // DEFAULT CODE // added aspectRatioClasses mapping for common ratios
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

// PRESET VARIANT - customization example

// AspectRatioPreset - customization // added preset component with label, ratio, and sizeHint props
interface AspectRatioPresetProps extends React.HTMLAttributes<HTMLDivElement> {
  // label prop: Human readable label (e.g., "16:9 banner")
  label: string
  // ratio prop: Numeric ratio (e.g., 16/9)
  ratio: number
  // sizeHint: Optional dimensions hint (e.g., "1280×720")
  sizeHint?: string
}

export function AspectRatioPreset({
  label,
  ratio,
  sizeHint,
  className,
  ...props
}: AspectRatioPresetProps) {
  return (
    <AspectRatio
      ratio={ratio}
      className={cn(
        "flex items-center justify-center border border-dashed border-border bg-muted/40", // added flex and dashed border styling
        className
      )}
      {...props}
    >
      <div className="text-center space-y-1">
        <p className="body-small font-semibold text-foreground">{label}</p>
        {sizeHint && (
          <p className="body-small text-muted-foreground">{sizeHint}</p>
        )}
      </div>
    </AspectRatio>
  )
}

export { AspectRatio }
