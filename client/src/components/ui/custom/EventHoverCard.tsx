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
  image?: string
}

export function EventHoverCard({
  title,
  date,
  tag,
  description,
  image,
  className,
  ...props
}: EventHoverCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border bg-background shadow-none p-0",
        className
      )}
      {...props}
    >
      <CardContent className="p-0 w-full h-full">
        <div className="relative aspect-[3/4] w-full">
          {/* Base surface */}
          <div className="absolute inset-0 bg-blue-50 transition-opacity duration-300 group-hover:opacity-60" />

          {/* Image */}
          {image && (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Dimming overlay on hover */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end items-start p-4 gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 w-full">
            {tag && (
              <Badge variant="outline" className="w-fit text-[10px] border-white/50 bg-white/10 text-white">
                {tag}
              </Badge>
            )}
            <div className="w-full text-left">
              <p className="body-small font-semibold text-white">{title}</p>
              {date && (
                <p className="body-small text-white/80 mt-0.5">{date}</p>
              )}
            </div>
            <p className="body-small text-white/70 line-clamp-3 text-left w-full">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
