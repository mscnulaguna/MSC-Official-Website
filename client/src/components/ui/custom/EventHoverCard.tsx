import * as React from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EventHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  date?: string
  tag?: string
  description: string
}

export function EventHoverCard({
  title,
  date,
  tag,
  description,
  className,
  ...props
}: EventHoverCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border bg-background shadow-none",
        className
      )}
      {...props}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          {/* Base surface */}
          <div className="absolute inset-0 bg-blue-50 transition-opacity duration-300 group-hover:opacity-60" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {tag && (
              <Badge variant="outline" className="w-fit text-[10px]">
                {tag}
              </Badge>
            )}
            <div>
              <p className="body-small font-semibold text-foreground">{title}</p>
              {date && (
                <p className="body-small text-muted-foreground mt-0.5">{date}</p>
              )}
            </div>
            <p className="body-small text-muted-foreground line-clamp-3">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
