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
  const [isTouched, setIsTouched] = React.useState(false)

  const handleClick = () => {
    setIsTouched(!isTouched)
  }

  const handleBlur = () => {
    setIsTouched(false)
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border bg-background shadow-none p-0 cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500",
        className
      )}
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onBlur={handleBlur}
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

          {/* Dimming overlay - visible on desktop hover/focus, or on mobile when touched */}
          <div className={cn(
            "absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-300",
            "md:group-hover:opacity-100 md:group-focus-within:opacity-100",
            isTouched && "opacity-100"
          )} />

          {/* Content overlay - visible on desktop hover/focus, or on mobile when touched */}
          <div className={cn(
            "absolute inset-0 flex flex-col justify-end items-start p-4 gap-2 translate-y-3 opacity-0 transition-all duration-300 w-full",
            "md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100",
            isTouched && "translate-y-0 opacity-100"
          )}>
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
