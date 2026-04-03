import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-none border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-blue-50 border-blue-200 text-blue-900 [&>svg]:text-blue-600",
        destructive:
          "bg-red-500 border-red-600 text-white [&>svg]:text-white",
        warning:
          "bg-yellow-500 border-yellow-600 text-white [&>svg]:text-white",
        success:
          "bg-green-500 border-green-600 text-white [&>svg]:text-white",
        info: "bg-blue-500 border-blue-600 text-white [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// Alert variants with icons
const AlertDestructive = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Alert ref={ref} variant="destructive" className={className} {...props}>
    <AlertCircle className="h-4 w-4" />
    {children}
  </Alert>
))
AlertDestructive.displayName = "AlertDestructive"

const AlertWarning = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Alert ref={ref} variant="warning" className={className} {...props}>
    <AlertTriangle className="h-4 w-4" />
    {children}
  </Alert>
))
AlertWarning.displayName = "AlertWarning"

const AlertSuccess = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Alert ref={ref} variant="success" className={className} {...props}>
    <CheckCircle2 className="h-4 w-4" />
    {children}
  </Alert>
))
AlertSuccess.displayName = "AlertSuccess"

const AlertInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Alert ref={ref} variant="info" className={className} {...props}>
    <Info className="h-4 w-4" />
    {children}
  </Alert>
))
AlertInfo.displayName = "AlertInfo"

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertDestructive,
  AlertWarning,
  AlertSuccess,
  AlertInfo,
  alertVariants,
}
