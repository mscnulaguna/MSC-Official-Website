"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/mscui/avatar"

type AvatarSize = "sm" | "md" | "lg"

export interface AvatarCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

export function AvatarCircle({
  src,
  alt,
  name = "MSC",
  size = "md",
  className,
  ...props
}: AvatarCircleProps) {
  const initials = React.useMemo(() => {
    if (!name) return "?"
    const parts = name.trim().split(" ")
    const first = parts[0]?.[0] ?? ""
    const second = parts[1]?.[0] ?? ""
    return (first + second || first).toUpperCase()
  }, [name])

  return (
    <Avatar
      className={cn(
        "rounded-full border border-border bg-secondary text-secondary-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback className="font-semibold text-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

export default AvatarCircle
