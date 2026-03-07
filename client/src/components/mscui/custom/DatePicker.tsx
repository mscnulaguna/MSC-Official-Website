"use client"

import * as React from "react"

import { Button } from "@/components/mscui/button"
import { Calendar } from "@/components/mscui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"

export interface DatePickerProps {
  label?: string
  buttonLabel?: string
}

export function DatePicker({
  label = "Date picker",
  buttonLabel = "Select date",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-2">
      {label && (
        <p className="body-small font-medium text-foreground">{label}</p>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>{buttonLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <Calendar />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePicker
