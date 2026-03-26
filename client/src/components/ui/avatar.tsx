import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

// DEFAULT CODE - base avatar root component
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-none border border-border bg-secondary text-secondary-foreground",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// DEFAULT CODE - avatar image component with object-cover
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// DEFAULT CODE - avatar fallback with centered text
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex items-center justify-center bg-muted text-muted-foreground font-medium text-sm",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// PRESET VARIANT - customization example

// AvatarCircle - customization // added size variants, initials generation, and circular styling
type AvatarSize = "sm" | "md" | "lg"

export interface AvatarCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  // src: Image URL to display
  src?: string
  // alt: Alternative text for image
  alt?: string
  // name: Full name for initials generation (e.g., "John Doe" → "JD")
  name?: string
  // size: Preset sizes for responsive avatars
  size?: AvatarSize
}

// size mapping // added sizeClasses for sm/md/lg variants
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
  // initials calculation // added useMemo to generate initials from name
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
        "rounded-full border border-border bg-secondary text-secondary-foreground", // added rounded-full for circular shape
        sizeClasses[size], // added dynamic sizing
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

export { Avatar, AvatarImage, AvatarFallback }
