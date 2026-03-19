import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

interface AspectRatioPresetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Human label, e.g. "16:9 banner" */
  label: string
  /** Numeric ratio, e.g. 16/9 */
  ratio: number
  /** Optional dimensions hint, e.g. "1280×720" */
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
        "flex items-center justify-center border border-dashed border-border bg-muted/40",
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
