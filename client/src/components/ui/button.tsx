import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Base button styles from shadcn (default)
const baseButtonStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-all border border-transparent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

// MSC customized button variants using design tokens
const mscButtonVariants = cva(baseButtonStyles, {
  variants: {
    variant: {
      // CUSTOMIZED: Using primary/secondary from design tokens + brightness animations
      default: "bg-primary text-primary-foreground hover:brightness-90",
      destructive: "bg-destructive text-white hover:brightness-90",
      // CUSTOMIZED: Custom outline with dark mode support
      outline:
        "border-border bg-background hover:bg-foreground hover:text-background dark:bg-input/30 dark:border-input dark:hover:bg-foreground dark:hover:text-background",
      outlinePrimary:
          "border-[var(--info)] bg-transparent text-[var(--info)] hover:bg-[var(--info)] hover:text-white",
      outlineSuccess:
          "border-[var(--success)] bg-transparent text-[var(--success)] hover:bg-[var(--success)] hover:text-white",
      outlineWarning:
          "border-[var(--warning)] bg-transparent text-[var(--warning)] hover:bg-[var(--warning)] hover:text-black",
      outlineInfo:
          "border-[var(--info)] bg-transparent text-[var(--info)] hover:bg-[var(--info)] hover:text-white",
      outlineDestructive:
          "border-[var(--destructive)] bg-transparent text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white",
      outlineGrey:
          "border-input bg-transparent text-muted-foreground hover:bg-input hover:text-foreground",
      
      secondary: "bg-secondary text-secondary-foreground hover:brightness-90",
      ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
      link: "text-primary underline-offset-4 hover:underline",
      
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 px-6 has-[>svg]:px-4",
      icon: "size-9",
      "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-8",
      "icon-lg": "size-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function MscButton({
  className = "cursor-pointer",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof mscButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      className={cn(mscButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { MscButton as Button, mscButtonVariants as buttonVariants }
