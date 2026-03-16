import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const mscAlertVariants = cva(
  "relative w-full rounded-none border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-secondary border-border text-secondary-foreground [&>svg]:text-secondary-foreground",
        destructive:
          "bg-destructive border-destructive text-white [&>svg]:text-white",
        warning:
          "bg-accent border-border text-accent-foreground [&>svg]:text-accent-foreground",
        success:
          "bg-primary border-primary text-primary-foreground [&>svg]:text-primary-foreground",
        info: "bg-muted border-border text-muted-foreground [&>svg]:text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const MscAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof mscAlertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(mscAlertVariants({ variant }), className)}
    {...props}
  />
))
MscAlert.displayName = "Alert"

const MscAlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
MscAlertTitle.displayName = "AlertTitle"

const MscAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
MscAlertDescription.displayName = "AlertDescription"

const MscAlertDestructive = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <MscAlert ref={ref} variant="destructive" className={className} {...props}>
    <AlertCircle className="h-4 w-4" />
    {children}
  </MscAlert>
))
MscAlertDestructive.displayName = "AlertDestructive"

const MscAlertWarning = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <MscAlert ref={ref} variant="warning" className={className} {...props}>
    <AlertTriangle className="h-4 w-4" />
    {children}
  </MscAlert>
))
MscAlertWarning.displayName = "AlertWarning"

const MscAlertSuccess = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <MscAlert ref={ref} variant="success" className={className} {...props}>
    <CheckCircle2 className="h-4 w-4" />
    {children}
  </MscAlert>
))
MscAlertSuccess.displayName = "AlertSuccess"

const MscAlertInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <MscAlert ref={ref} variant="info" className={className} {...props}>
    <Info className="h-4 w-4" />
    {children}
  </MscAlert>
))
MscAlertInfo.displayName = "AlertInfo"

export {
  MscAlert as Alert,
  MscAlertTitle as AlertTitle,
  MscAlertDescription as AlertDescription,
  MscAlertDestructive as AlertDestructive,
  MscAlertWarning as AlertWarning,
  MscAlertSuccess as AlertSuccess,
  MscAlertInfo as AlertInfo,
  mscAlertVariants as alertVariants,
}
