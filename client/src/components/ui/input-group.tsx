import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      className
    )}
    {...props}
  />
))
InputGroup.displayName = "InputGroup"

const InputGroupPrefix = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute left-3 flex items-center pointer-events-none", className)}
    {...props}
  />
))
InputGroupPrefix.displayName = "InputGroupPrefix"

const InputGroupContent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full flex-1 border-0 bg-transparent px-8 py-0 text-foreground placeholder:text-foreground/50 dark:placeholder:text-foreground/60 focus:outline-none",
      className
    )}
    {...props}
  />
))
InputGroupContent.displayName = "InputGroupContent"

const InputGroupSuffix = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute right-3 flex items-center pointer-events-none", className)}
    {...props}
  />
))
InputGroupSuffix.displayName = "InputGroupSuffix"

export {
  InputGroup,
  InputGroupPrefix,
  InputGroupContent,
  InputGroupSuffix,
}
