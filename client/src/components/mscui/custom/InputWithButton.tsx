"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/mscui/input"
import { Button } from "@/components/mscui/button"

export interface InputWithButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  placeholder?: string
  buttonLabel?: string
  note?: string
  onSubmit?: (value: string) => void
}

export function InputWithButton({
  label = "Label",
  placeholder = "Enter a value",
  buttonLabel = "Apply",
  note,
  onSubmit,
  className,
  ...props
}: InputWithButtonProps) {
  const [value, setValue] = React.useState("")

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(value)
    }
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <p className="body-small font-medium text-foreground">
          {label}
        </p>
      )}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" onClick={handleSubmit}>
          {buttonLabel}
        </Button>
      </div>
      {note && (
        <p className="body-small text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  )
}

export default InputWithButton
