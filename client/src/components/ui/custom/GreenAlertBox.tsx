import * as React from "react"

import {
  AlertSuccess,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert"

export interface GreenAlertBoxProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function GreenAlertBox({
  title = "Success",
  description = "Your changes have been saved successfully.",
  className,
  ...props
}: GreenAlertBoxProps) {
  return (
    <AlertSuccess className={className} {...props}>
      <AlertTitle>{title}</AlertTitle>
      {description && (
        <AlertDescription>{description}</AlertDescription>
      )}
    </AlertSuccess>
  )
}

export default GreenAlertBox
